require('dotenv').config();

console.log('🔍 Testing MongoDB Connection String...\n');

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.log('❌ MONGODB_URI is not set');
  console.log('💡 Please set it in your .env file or Railway environment variables');
  process.exit(1);
}

console.log('✅ MONGODB_URI is set');
console.log('📏 Length:', mongoURI.length);
console.log('🔗 Starts with:', mongoURI.substring(0, 20) + '...');

if (mongoURI.startsWith('mongodb://') || mongoURI.startsWith('mongodb+srv://')) {
  console.log('✅ Format is valid');
  
  // Extract parts for verification
  try {
    const url = new URL(mongoURI);
    console.log('🌐 Protocol:', url.protocol);
    console.log('👤 Username:', url.username);
    console.log('🔑 Password exists:', !!url.password);
    console.log('🏠 Host:', url.hostname);
    console.log('🗄️  Database:', url.pathname.substring(1));
    
    if (url.password) {
      console.log('🔑 Password length:', url.password.length);
    }
    
  } catch (error) {
    console.log('⚠️  Could not parse URL structure');
  }
  
} else {
  console.log('❌ Invalid format');
  console.log('💡 Expected: mongodb:// or mongodb+srv://');
  console.log('💡 Got:', mongoURI.substring(0, 20) + '...');
}

console.log('\n📋 Example of correct format:');
console.log('mongodb+srv://username:password@cluster.mongodb.net/database');
console.log('mongodb://username:password@localhost:27017/database');
