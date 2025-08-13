const axios = require('axios');

const RAILWAY_BACKEND_URL = 'https://algotutorai-production.up.railway.app';

async function testSimpleProblem() {
  try {
    console.log('🧪 Testing simple problem creation...');
    
    // Test with a very simple problem that matches the schema exactly
    const simpleProblem = {
      title: "Test Problem",
      description: "This is a test problem",
      difficulty: "easy", // Must be lowercase to match enum
      category: "Test",
      topics: ["Test"],
      examples: [
        {
          input: "test input",
          output: "test output",
          explanation: "test explanation"
        }
      ],
      testCases: [
        {
          input: "test",
          expectedOutput: "test" // Changed from 'output' to 'expectedOutput'
        }
      ],
      constraints: ["No special constraints"],
      hints: ["This is a test hint"],
      solution: "function test() { return 'test'; }"
    };
    
    console.log('📝 Attempting to create test problem...');
    const response = await axios.post(`${RAILWAY_BACKEND_URL}/api/problems`, simpleProblem);
    
    console.log('✅ Success! Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error details:');
    console.error('   Status:', error.response?.status);
    console.error('   Data:', error.response?.data);
    console.error('   Message:', error.message);
    
    if (error.response?.data?.error) {
      console.error('   Backend error:', error.response.data.error);
    }
  }
}

testSimpleProblem();
