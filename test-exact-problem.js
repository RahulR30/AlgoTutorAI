const axios = require('axios');

const RAILWAY_BACKEND_URL = 'https://algotutorai-production.up.railway.app';

async function testExactProblem() {
  try {
    console.log('🧪 Testing exact problem structure...');
    
    // Test with a problem that matches the exact schema from local database
    const exactProblem = {
      title: "Test Problem Exact",
      description: "This is a test problem with exact schema match",
      difficulty: "easy",
      topics: ["test", "example"],
      constraints: ["No special constraints"],
      examples: [
        {
          input: "test input",
          output: "test output",
          explanation: "test explanation"
        }
      ],
      testCases: [
        {
          input: "simple test",
          expectedOutput: "simple test",
          isHidden: false
        }
      ],
      solution: "function test() { return 'test'; }",
      hints: ["This is a test hint"],
      category: "test",
      estimatedTime: 15,
      prerequisites: [],
      learningObjectives: ["Testing", "Schema validation"]
    };
    
    console.log('📝 Attempting to create exact problem...');
    const response = await axios.post(`${RAILWAY_BACKEND_URL}/api/problems`, exactProblem);
    
    console.log('✅ Success! Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error details:');
    console.error('   Status:', error.response?.status);
    console.error('   Data:', error.response?.data);
    console.error('   Message:', error.message);
    
    if (error.response?.data?.error) {
      console.error('   Backend error:', error.response.data.error);
    }
    
    if (error.response?.data?.details) {
      console.error('   Error details:', error.response.data.details);
    }
    
    if (error.response?.data?.field) {
      console.error('   Failed field:', error.response.data.field);
    }
  }
}

testExactProblem();
