# AI Route - Enhanced Problem Generation

This document describes the enhanced AI route that generates comprehensive coding problems with all necessary details for proper display in the AlgoTutor platform.

## Overview

The AI route has been significantly enhanced to ensure that all generated problems include:
- **Comprehensive examples** with proper input, output, and explanations
- **Multiple test cases** with proper input/output formats
- **Detailed constraints** explaining time and space complexity
- **Helpful hints** to guide students
- **Complete solutions** with code examples
- **Learning objectives** and prerequisites
- **Proper schema compliance** matching the Problem model

## Key Features

### 1. Template-Based Generation
- Uses comprehensive, pre-validated templates instead of unreliable AI generation
- Ensures logical consistency and educational value
- Provides multiple variations for each problem type

### 2. Schema Compliance
- All generated problems match the exact Problem model schema
- Automatic validation and fixing of logical inconsistencies
- Proper formatting of examples, test cases, and constraints

### 3. Learning-Focused Design
- Problems are designed with specific learning objectives
- Includes prerequisites and estimated completion time
- Tailored difficulty based on user performance

## API Endpoints

### 1. Generate Individual Problem
```http
POST /api/ai/generate-problem
```

**Request Body:**
```json
{
  "topic": "arrays",
  "difficulty": "easy",
  "subtopics": ["sum", "iteration"],
  "learningObjectives": ["Master array operations"],
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "message": "Problem generated successfully",
  "problem": {
    "title": "Array Sum",
    "description": "Calculate the sum of all elements in an array...",
    "examples": [...],
    "testCases": [...],
    "constraints": [...],
    "solution": "function solution(arr) {...}",
    "hints": [...],
    "learningObjectives": [...],
    "prerequisites": [...]
  }
}
```

### 2. Generate Problem Database
```http
POST /api/ai/generate-problem-database
```

**Request Body:**
```json
{
  "topics": ["arrays", "strings"],
  "difficulty": "all",
  "count": 50
}
```

**Response:**
```json
{
  "message": "Problem database generated successfully",
  "totalGenerated": 50,
  "totalSaved": 50,
  "problems": [...],
  "summary": {
    "byDifficulty": {...},
    "byTopic": {...},
    "byCategory": {...}
  }
}
```

### 3. Generate Learning Problem
```http
POST /api/ai/generate-learning-problem
```

**Request Body:**
```json
{
  "learningObjective": "Master array sum operations",
  "topic": "arrays",
  "difficulty": "easy",
  "complexity": "standard",
  "includeExamples": true,
  "includeTestCases": true,
  "includeHints": true
}
```

### 4. Get Problem Details
```http
GET /api/ai/problem/:id
```

### 5. Get Problems by Criteria
```http
GET /api/ai/problems?topic=arrays&difficulty=easy&limit=20&page=1
```

### 6. Update Problem
```http
PUT /api/ai/problem/:id
```

### 7. Get Problem Statistics
```http
GET /api/ai/problem-stats/:id
```

## Problem Structure

### Example Structure
```json
{
  "title": "Array Sum",
  "description": "Calculate the sum of all elements in an array of integers...",
  "difficulty": "easy",
  "topics": ["arrays"],
  "examples": [
    {
      "input": "[1, 2, 3, 4, 5]",
      "output": "15",
      "explanation": "The sum of all numbers is 1+2+3+4+5 = 15"
    }
  ],
  "testCases": [
    {
      "input": { "arr": [1, 2, 3, 4, 5] },
      "expectedOutput": 15,
      "isHidden": false
    }
  ],
  "constraints": [
    "Time: O(n) - need to iterate through all elements",
    "Space: O(1) - only using a single variable for sum"
  ],
  "solution": "function solution(arr) { return arr.reduce((sum, num) => sum + num, 0); }",
  "hints": [
    "Use reduce() method or a simple loop",
    "Start with sum = 0"
  ],
  "learningObjectives": ["Master array iteration", "Understand reduce operations"],
  "prerequisites": ["Basic JavaScript knowledge", "Understanding of arrays"],
  "estimatedTime": 10,
  "category": "arrays"
}
```

## Available Topics

- **Arrays**: sum, maximum, missing number, subarray sum
- **Strings**: reverse, palindrome, validation
- **Linked Lists**: reverse, cycle detection
- **Stacks & Queues**: implementation, operations
- **Trees**: traversal, height, balance
- **Graphs**: BFS, DFS, shortest path
- **Dynamic Programming**: memoization, tabulation
- **Greedy**: optimal choice, local optimization
- **And more...**

## Available Difficulties

- **Easy**: Basic concepts, simple algorithms
- **Medium**: Intermediate algorithms, optimization
- **Hard**: Complex algorithms, advanced techniques

## Validation Features

### 1. Example Validation
- Ensures input/output consistency
- Fixes logical errors (e.g., reverse string examples)
- Validates mathematical operations (e.g., sum calculations)

### 2. Test Case Validation
- Ensures test cases match examples
- Validates input/output formats
- Sets appropriate `isHidden` flags

### 3. Constraint Validation
- Ensures constraints are descriptive
- Adds context to generic constraints
- Validates time/space complexity statements

## Usage Examples

### Generate a Simple Array Problem
```javascript
const response = await fetch('/api/ai/generate-problem', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    topic: 'arrays',
    difficulty: 'easy'
  })
});

const { problem } = await response.json();
console.log('Generated problem:', problem.title);
console.log('Examples:', problem.examples.length);
console.log('Test cases:', problem.testCases.length);
```

### Generate Multiple Problems
```javascript
const response = await fetch('/api/ai/generate-problem-database', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    topics: ['arrays', 'strings'],
    difficulty: 'all',
    count: 20
  })
});

const { problems, summary } = await response.json();
console.log(`Generated ${problems.length} problems`);
console.log('Summary by difficulty:', summary.byDifficulty);
```

## Testing

Run the test script to verify the AI route functionality:

```bash
cd server
node test-ai-route.js
```

This will test:
- Individual problem generation
- Problem database generation
- Learning problem generation
- Schema compliance validation

## Best Practices

### 1. Problem Generation
- Use specific learning objectives for targeted practice
- Include multiple test cases for comprehensive testing
- Provide clear, actionable hints

### 2. Content Quality
- Ensure examples are logically consistent
- Validate test case input/output formats
- Include edge cases in test scenarios

### 3. Performance
- Use pagination for large problem sets
- Implement caching for frequently accessed problems
- Monitor generation performance

## Troubleshooting

### Common Issues

1. **Missing Examples**: Check if `includeExamples` is set to true
2. **Invalid Test Cases**: Ensure input/output format matches expected schema
3. **Schema Validation Errors**: Check required fields and data types
4. **Performance Issues**: Reduce problem count or use pagination

### Debug Information

The API provides detailed logging for debugging:
- Problem generation steps
- Validation results
- Schema compliance checks
- Error details with context

## Future Enhancements

- **AI-Powered Generation**: Integrate with advanced LLMs for dynamic content
- **Adaptive Difficulty**: Adjust problem complexity based on user performance
- **Content Personalization**: Generate problems based on learning style
- **Multilingual Support**: Generate problems in multiple programming languages
- **Interactive Examples**: Include step-by-step solution walkthroughs

## Support

For issues or questions about the AI route:
1. Check the test script output
2. Review API response logs
3. Verify schema compliance
4. Check MongoDB connection and permissions
