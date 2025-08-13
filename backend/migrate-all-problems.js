const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Problem = require('./models/Problem');

async function migrateAllProblems() {
  try {
    console.log('🔄 Starting migration of ALL problems to Railway backend...');
    
    // Connect to local MongoDB
    console.log('📊 Connecting to local MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('✅ Connected to local MongoDB');
    
    // Get all problems from local database
    console.log('📥 Fetching all problems from local database...');
    const localProblems = await Problem.find({}).lean();
    console.log(`📋 Found ${localProblems.length} problems in local database`);
    
    // Disconnect from local MongoDB
    await mongoose.disconnect();
    console.log('📊 Disconnected from local MongoDB');
    
    // Connect to Railway backend (MongoDB Atlas)
    console.log('☁️  Connecting to Railway backend (MongoDB Atlas)...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to Railway backend');
    
    // Check current problems in Railway backend
    const existingProblems = await Problem.countDocuments();
    console.log(`📊 Current problems in Railway backend: ${existingProblems}`);
    
    if (existingProblems > 0) {
      console.log('⚠️  Clearing existing problems in Railway backend...');
      await Problem.deleteMany({});
      console.log('✅ Cleared existing problems');
    }
    
    // Prepare problems for migration (add slugs if missing)
    console.log('🔧 Preparing problems for migration...');
    const problemsToMigrate = localProblems.map(problem => {
      // Ensure slug exists
      if (!problem.slug) {
        problem.slug = problem.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      }
      
      // Remove MongoDB-specific fields
      delete problem._id;
      delete problem.__v;
      
      return problem;
    });
    
    console.log(`📝 Migrating ${problemsToMigrate.length} problems...`);
    
    // Insert problems in batches to avoid memory issues
    const batchSize = 50;
    let migratedCount = 0;
    
    for (let i = 0; i < problemsToMigrate.length; i += batchSize) {
      const batch = problemsToMigrate.slice(i, i + batchSize);
      
      try {
        await Problem.insertMany(batch, { ordered: false });
        migratedCount += batch.length;
        console.log(`✅ Migrated batch ${Math.floor(i / batchSize) + 1}: ${batch.length} problems (Total: ${migratedCount}/${problemsToMigrate.length})`);
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error (slug already exists)
          console.log(`⚠️  Some problems in batch ${Math.floor(i / batchSize) + 1} had duplicate slugs, continuing...`);
          migratedCount += batch.length;
        } else {
          console.error(`❌ Error migrating batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        }
      }
    }
    
    // Verify the migration
    console.log('\n🔍 Verifying migration...');
    const finalCount = await Problem.countDocuments();
    console.log(`📊 Final problems count in Railway backend: ${finalCount}`);
    
    // Show some sample migrated problems
    const sampleProblems = await Problem.find().limit(5).select('title difficulty category topics');
    console.log('\n📋 Sample migrated problems:');
    sampleProblems.forEach((problem, index) => {
      console.log(`   ${index + 1}. ${problem.title} (${problem.difficulty}) - ${problem.category}`);
    });
    
    if (finalCount > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log(`📊 Migrated ${finalCount} problems to Railway backend`);
      console.log('\n🔗 Your backend is now ready at:');
      console.log(`   https://algotutorai-production.up.railway.app`);
      console.log('\n📱 Test the problems endpoint:');
      console.log(`   https://algotutorai-production.up.railway.app/api/problems`);
      console.log('\n🌐 Your frontend should now show ALL problems!');
    } else {
      console.log('\n⚠️  No problems were migrated. Check the logs above for errors.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('❌ Error details:', error.message);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('📊 Disconnected from Railway backend');
    }
  }
}

if (require.main === module) {
  migrateAllProblems();
}
