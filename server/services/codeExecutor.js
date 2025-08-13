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
      
      // Create test file
      const testFile = await this.createTestFile(language, code, testCase, tempDir, index);
      
      // Execute the code
      const { stdout, stderr, executionTime } = await this.executeFile(language, testFile, tempDir);
      
      // Parse and validate output
      const actualOutput = this.parseOutput(language, stdout);
      const isCorrect = this.compareOutput(actualOutput, testCase.expectedOutput);
      
      return {
        testCaseIndex: index,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
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
const result = ${this.getJavaScriptFunctionCall(testCase.input)};
console.log(JSON.stringify(result));
`;
  }

  wrapPythonCode(code, testCase) {
    return `
${code}

# Test case
import json
input_data = ${JSON.stringify(testCase.input)}
result = ${this.getPythonFunctionCall(testCase.input)}
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

  getJavaScriptFunctionCall(input) {
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

  getPythonFunctionCall(input) {
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
