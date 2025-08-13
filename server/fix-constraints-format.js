const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Function to convert simple constraints array to structured format
function convertConstraintsToStructured(constraints) {
  if (!constraints || !Array.isArray(constraints) || constraints.length === 0) {
    return null;
  }
  
  const structured = {
    timeComplexity: '',
    spaceComplexity: '',
    inputConstraints: []
  };
  
  for (const constraint of constraints) {
    if (constraint.toLowerCase().includes('time') && constraint.toLowerCase().includes('o(')) {
      structured.timeComplexity = constraint;
    } else if (constraint.toLowerCase().includes('space') && constraint.toLowerCase().includes('o(')) {
      structured.spaceComplexity = constraint;
    } else {
      structured.inputConstraints.push(constraint);
    }
  }
  
  // If we couldn't parse time/space complexity, try to extract from constraints
  if (!structured.timeComplexity) {
    const timeConstraint = constraints.find(c => c.toLowerCase().includes('time'));
    if (timeConstraint) {
      structured.timeComplexity = timeConstraint;
    }
  }
  
  if (!structured.spaceComplexity) {
    const spaceConstraint = constraints.find(c => c.toLowerCase().includes('space'));
    if (spaceConstraint) {
      structured.spaceComplexity = spaceConstraint;
    }
  }
  
  // If still no time/space complexity, create default ones
  if (!structured.timeComplexity) {
    structured.timeComplexity = 'Time: O(n) - linear time complexity';
  }
  
  if (!structured.spaceComplexity) {
    structured.spaceComplexity = 'Space: O(1) - constant extra space';
  }
  
  return structured;
}

// Function to fix a single problem's constraints format
async function fixProblemConstraintsFormat(problem) {
  // Check if problem needs fixing
  if (!problem.constraints || !Array.isArray(problem.constraints) || problem.constraints.length === 0) {
    console.log(`⚠️  ${problem.title} - no constraints to fix`);
    return false;
  }
  
  // Check if constraints are already in structured format
  if (problem.constraints.timeComplexity || problem.constraints.spaceComplexity) {
    console.log(`✅ ${problem.title} - constraints already structured`);
    return false;
  }
  
  // Convert constraints to structured format
  const structuredConstraints = convertConstraintsToStructured(problem.constraints);
  
  if (!structuredConstraints) {
    console.log(`⚠️  ${problem.title} - could not convert constraints`);
    return false;
  }
  
  try {
    await Problem.findByIdAndUpdate(problem._id, {
      constraints: structuredConstraints
    });
    console.log(`✅ Fixed constraints format: ${problem.title}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to fix ${problem.title}:`, error.message);
    return false;
  }
}

// Main function to fix all problems' constraints format
async function fixAllConstraintsFormat() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('📊 Connected to MongoDB');
    
    // Get all problems
    const problems = await Problem.find({ isActive: true });
    console.log(`🔍 Found ${problems.length} problems to check for constraints format`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    // Fix each problem
    for (const problem of problems) {
      const wasFixed = await fixProblemConstraintsFormat(problem);
      if (wasFixed) {
        fixedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log(`\n🎉 Constraints format fixing completed!`);
    console.log(`✅ Fixed: ${fixedCount} problems`);
    console.log(`⏭️  Skipped: ${skippedCount} problems`);
    console.log(`🌐 Open http://localhost:3000 to view the fixed constraints`);
    
  } catch (error) {
    console.error('❌ Error fixing constraints format:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  fixAllConstraintsFormat();
}

module.exports = { fixAllConstraintsFormat };
