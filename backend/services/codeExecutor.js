const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class CodeExecutor {
  constructor() {
    this.tempDir = os.tmpdir();
  }

  async executeCode(language, code, testCases, problemId) {
    try {
      const tempDir = path.join(this.tempDir, `algotutor-${problemId}-${Date.now()}`);
      await fs.mkdir(tempDir, { recursive: true });

      const results = [];
      
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const result = await this.runTestCase(language, code, testCase, tempDir, i);
        results.push(result);
      }

      // Clean up temp directory
      await this.cleanup(tempDir);

      return {
        executionResults: results,
        overallResult: this.calculateOverallResult(results)
      };
    } catch (error) {
      console.error('Code execution error:', error);
      throw new Error('Failed to execute code');
    }
  }

  async runTestCase(language, code, testCase, tempDir, index) {
    try {
      const startTime = Date.now();
      
      // Parse test case input and expected output
      const parsedInput = this.parseTestCaseInput(testCase.input);
      const parsedExpectedOutput = this.parseTestCaseInput(testCase.expectedOutput);
      
      // Create test file with parsed data
      const testFile = await this.createTestFile(language, code, { ...testCase, input: parsedInput, expectedOutput: parsedExpectedOutput }, tempDir, index);
      
      // Execute the code
      const { stdout, stderr, executionTime } = await this.executeFile(language, testFile, tempDir);
      
      // Parse and validate output
      const actualOutput = this.parseOutput(language, stdout);
      const isCorrect = this.compareOutput(actualOutput, parsedExpectedOutput);
      
      return {
        testCaseIndex: index,
        input: parsedInput,
        expectedOutput: parsedExpectedOutput,
        actualOutput: actualOutput,
        isCorrect: isCorrect,
        executionTime: executionTime,
        memoryUsed: 0, // Simplified for now
        errorMessage: stderr || null
      };
    } catch (error) {
      return {
        testCaseIndex: index,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        isCorrect: false,
        executionTime: 0,
        memoryUsed: 0,
        errorMessage: error.message
      };
    }
  }

  async createTestFile(language, code, testCase, tempDir, index) {
    const filename = `solution_${index}.${this.getFileExtension(language)}`;
    const filepath = path.join(tempDir, filename);
    
    let fullCode = '';
    
    switch (language) {
      case 'javascript':
        fullCode = this.wrapJavaScriptCode(code, testCase);
        break;
      case 'python':
        fullCode = this.wrapPythonCode(code, testCase);
        break;
      case 'java':
        fullCode = this.wrapJavaCode(code, testCase);
        break;
      case 'cpp':
        fullCode = this.wrapCppCode(code, testCase);
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
    
    await fs.writeFile(filepath, fullCode);
    return filepath;
  }

  wrapJavaScriptCode(code, testCase) {
    return `
${code}

// Test case
const input = ${JSON.stringify(testCase.input)};
const result = ${this.getJavaScriptFunctionCall(testCase.input, code)};
console.log(JSON.stringify(result));
`;
  }

  wrapPythonCode(code, testCase) {
    return `
${code}

# Test case
import json
input_data = ${JSON.stringify(testCase.input)}
result = ${this.getPythonFunctionCall(testCase.input, code)}
print(json.dumps(result))
`;
  }

  wrapJavaCode(code, testCase) {
    const className = 'Solution';
    return `
import java.util.*;
import java.io.*;

public class ${className} {
    ${code}
    
    public static void main(String[] args) {
        ${className} solution = new ${className}();
        ${this.getJavaTestCode(testCase)}
    }
}`;
  }

  wrapCppCode(code, testCase) {
    return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;

${code}

int main() {
    ${this.getCppTestCode(testCase)}
    return 0;
}`;
  }

  getJavaScriptFunctionCall(input, code) {
    // Try to detect function name from code
    const functionMatch = code.match(/function\s+(\w+)\s*\(/);
    if (functionMatch) {
      const functionName = functionMatch[1];
      return `${functionName}(${this.getJavaScriptArguments(input)})`;
    }
    
    // Fallback to common patterns
    if (input.nums && input.target !== undefined) {
      return 'twoSum(input.nums, input.target)';
    } else if (input.s) {
      return 'isValid(input.s)';
    } else if (input.nums && !input.target) {
      return 'maxSubArray(input.nums)';
    } else if (input.n !== undefined) {
      return 'climbStairs(input.n)';
    }
    return 'solution(input)';
  }

  getPythonFunctionCall(input, code) {
    // Try to detect function name from code
    const functionMatch = code.match(/def\s+(\w+)\s*\(/);
    if (functionMatch) {
      const functionName = functionMatch[1];
      return `${functionName}(${this.getPythonArguments(input)})`;
    }
    
    // Fallback to common patterns
    if (input.nums && input.target !== undefined) {
      return 'twoSum(input["nums"], input["target"])';
    } else if (input.s) {
      return 'isValid(input["s"])';
    } else if (input.nums && !input.target) {
      return 'maxSubArray(input["nums"])';
    } else if (input.n !== undefined) {
      return 'climbStairs(input["n"])';
    }
    return 'solution(input)';
  }

  getJavaScriptArguments(input) {
    if (Array.isArray(input)) {
      return input.map(arg => JSON.stringify(arg)).join(', ');
    } else if (typeof input === 'object' && input !== null) {
      return Object.entries(input).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(', ');
    } else {
      return JSON.stringify(input);
    }
  }

  getPythonArguments(input) {
    if (Array.isArray(input)) {
      return input.map(arg => this.pythonValueToString(arg)).join(', ');
    } else if (typeof input === 'object' && input !== null) {
      return Object.entries(input).map(([key, value]) => `${key}=${this.pythonValueToString(value)}`).join(', ');
    } else {
      return this.pythonValueToString(input);
    }
  }

  pythonValueToString(value) {
    if (typeof value === 'string') {
      return `"${value}"`;
    } else if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    } else if (value === null) {
      return 'None';
    } else if (Array.isArray(value)) {
      return `[${value.map(v => this.pythonValueToString(v)).join(', ')}]`;
    } else {
      return String(value);
    }
  }

  getJavaTestCode(testCase) {
    if (testCase.input.nums && testCase.input.target !== undefined) {
      return `
        int[] nums = ${JSON.stringify(testCase.input.nums).replace(/\[/g, '{').replace(/\]/g, '}')};
        int target = ${testCase.input.target};
        int[] result = solution.twoSum(nums, target);
        System.out.println(Arrays.toString(result));
      `;
    } else if (testCase.input.s) {
      return `
        String s = "${testCase.input.s}";
        boolean result = solution.isValid(s);
        System.out.println(result);
      `;
    }
    return 'System.out.println("Test case not implemented");';
  }

  getCppTestCode(testCase) {
    if (testCase.input.nums && testCase.input.target !== undefined) {
      return `
        vector<int> nums = ${JSON.stringify(testCase.input.nums)};
        int target = ${testCase.input.target};
        vector<int> result = twoSum(nums, target);
        cout << "[" << result[0] << "," << result[1] << "]" << endl;
      `;
    } else if (testCase.input.s) {
      return `
        string s = "${testCase.input.s}";
        bool result = isValid(s);
        cout << (result ? "true" : "false") << endl;
      `;
    }
    return 'cout << "Test case not implemented" << endl;';
  }

  getFileExtension(language) {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp'
    };
    return extensions[language] || 'txt';
  }

  // Parse test case input/output from string format to actual data structures
  parseTestCaseInput(input) {
    if (typeof input === 'string') {
      try {
        // Try to parse as JSON first
        return JSON.parse(input);
      } catch (e) {
        // If not valid JSON, try to parse common formats
        if (input.startsWith('[') && input.endsWith(']')) {
          // Array format like "[1,2,3]"
          return input.slice(1, -1).split(',').map(x => {
            const trimmed = x.trim();
            if (trimmed === 'true') return true;
            if (trimmed === 'false') return false;
            if (trimmed === 'null') return null;
            if (trimmed === 'undefined') return undefined;
            if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
            if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
            const num = Number(trimmed);
            return isNaN(num) ? trimmed : num;
          });
        } else if (input.startsWith('{') && input.endsWith('}')) {
          // Object format like "{a:1,b:2}"
          try {
            return JSON.parse(input);
          } catch (e) {
            // Try to parse simple object format
            const obj = {};
            const content = input.slice(1, -1);
            const pairs = content.split(',').map(pair => pair.trim());
            pairs.forEach(pair => {
              const [key, value] = pair.split(':').map(x => x.trim());
              if (key && value !== undefined) {
                obj[key] = this.parseTestCaseInput(value);
              }
            });
            return obj;
          }
        } else if (input === 'true' || input === 'false') {
          return input === 'true';
        } else if (input === 'null') {
          return null;
        } else if (input === 'undefined') {
          return undefined;
        } else if (!isNaN(Number(input))) {
          return Number(input);
        } else if ((input.startsWith('"') && input.endsWith('"')) || 
                   (input.startsWith("'") && input.endsWith("'"))) {
          return input.slice(1, -1);
        }
      }
    }
    return input;
  }

  async executeFile(language, filepath, tempDir) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let command = '';
      
      switch (language) {
        case 'javascript':
          command = `node "${filepath}"`;
          break;
        case 'python':
          command = `python3 "${filepath}"`;
          break;
        case 'java':
          const className = path.basename(filepath, '.java');
          command = `cd "${tempDir}" && javac "${path.basename(filepath)}" && java ${className}`;
          break;
        case 'cpp':
          const outputFile = path.join(tempDir, 'solution');
          command = `g++ "${filepath}" -o "${outputFile}" && "${outputFile}"`;
          break;
        default:
          reject(new Error(`Unsupported language: ${language}`));
          return;
      }

      exec(command, { 
        timeout: 10000, // 10 second timeout
        cwd: tempDir 
      }, (error, stdout, stderr) => {
        const executionTime = Date.now() - startTime;
        
        if (error && error.code === 'ETIMEDOUT') {
          reject(new Error('Execution timeout'));
          return;
        }
        
        resolve({ stdout, stderr, executionTime });
      });
    });
  }

  parseOutput(language, stdout) {
    try {
      const cleanOutput = stdout.trim();
      
      // Try to parse as JSON first
      try {
        return JSON.parse(cleanOutput);
      } catch {
        // Handle different output formats
        if (cleanOutput === 'true' || cleanOutput === 'false') {
          return cleanOutput === 'true';
        }
        if (cleanOutput === 'null') {
          return null;
        }
        if (!isNaN(cleanOutput)) {
          return parseInt(cleanOutput);
        }
        if (cleanOutput.startsWith('[') && cleanOutput.endsWith(']')) {
          return JSON.parse(cleanOutput);
        }
        return cleanOutput;
      }
    } catch (error) {
      return stdout.trim();
    }
  }

  compareOutput(actual, expected) {
    if (actual === expected) return true;
    
    // Handle array comparison
    if (Array.isArray(actual) && Array.isArray(expected)) {
      if (actual.length !== expected.length) return false;
      return actual.every((val, index) => val === expected[index]);
    }
    
    // Handle object comparison for some cases
    if (typeof actual === 'object' && typeof expected === 'object') {
      return JSON.stringify(actual) === JSON.stringify(expected);
    }
    
    return false;
  }

  calculateOverallResult(results) {
    const totalTestCases = results.length;
    const passedTestCases = results.filter(r => r.isCorrect).length;
    const totalExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0);
    const averageExecutionTime = totalExecutionTime / totalTestCases;
    const score = Math.round((passedTestCases / totalTestCases) * 100);
    
    return {
      isCorrect: passedTestCases === totalTestCases,
      totalTestCases,
      passedTestCases,
      executionTime: averageExecutionTime,
      memoryUsed: 0,
      score
    };
  }

  async cleanup(tempDir) {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.warn('Failed to cleanup temp directory:', error);
    }
  }
}

module.exports = new CodeExecutor();
