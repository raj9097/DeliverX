/**
 * MongoDB Connection Diagnostic Tool
 * Run: npm run test:db
 * 
 * Tests MongoDB connection and provides diagnostic information
 */

require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const testDatabaseConnection = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/DeliverX';
  
  console.log('\n' + '='.repeat(60));
  console.log('🔍 MongoDB Connection Diagnostic');
  console.log('='.repeat(60) + '\n');

  console.log('📋 Configuration:');
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Connection String: ${mongoURI.replace(/:[^:]*@/, ':***@')}\n`);

  // Hide password in display
  const displayURI = mongoURI.substring(0, mongoURI.indexOf('@') + 1) + '...';
  console.log(`  Display: ${displayURI}\n`);

  try {
    console.log('🔄 Attempting to connect...\n');

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const connection = await mongoose.connect(mongoURI, options);

    console.log('✅ Connection Successful!\n');

    // Get database statistics
    const admin = mongoose.connection.db.admin();
    const dbStats = await admin.stats();

    console.log('📊 Database Statistics:');
    console.log(`  Database Name: ${dbStats.db}`);
    console.log(`  Collections: ${dbStats.collections}`);
    console.log(`  Data Size: ${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Storage Size: ${(dbStats.storageSize / 1024 / 1024).toFixed(2)} MB\n`);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.length > 0) {
      console.log('📚 Collections:');
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    } else {
      console.log('⚠️  No collections found. Run: npm run seed');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All checks passed! Your backend is ready.');
    console.log('='.repeat(60) + '\n');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Connection Failed!\n');
    console.error('Error Details:');
    console.error(`  Code: ${error.code}`);
    console.error(`  Message: ${error.message}\n`);

    console.error('🔧 Troubleshooting Steps:\n');

    if (error.message.includes('IP that isn\'t whitelisted')) {
      console.error('  ⚠️  IP Whitelist Error');
      console.error('  └─ Fix: https://www.mongodb.com/docs/atlas/security-whitelist/');
      console.error('     1. Go to MongoDB Atlas Dashboard');
      console.error('     2. Click "Security" → "Network Access"');
      console.error('     3. Add your IP address (or 0.0.0.0/0 for development)');
      console.error('     4. Wait 1-2 minutes and try again\n');
    }

    if (error.message.includes('authentication failed')) {
      console.error('  ⚠️  Authentication Error');
      console.error('  └─ Fix: Check username and password in MONGO_URI');
      console.error('     Make sure no special characters need escaping\n');
    }

    if (error.message.includes('ECONNREFUSED')) {
      console.error('  ⚠️  Connection Refused');
      console.error('  └─ For Local MongoDB:');
      console.error('     1. Install MongoDB: https://www.mongodb.com/try/download/community');
      console.error('     2. Start MongoDB: mongod');
      console.error('  └─ For MongoDB Atlas:');
      console.error('     1. Check your internet connection');
      console.error('     2. Verify MONGO_URI is correct\n');
    }

    console.error('📝 Configuration Check:');
    console.log(`  MONGO_URI set: ${!!process.env.MONGO_URI ? '✅ Yes' : '❌ No (using default)'}`);
    console.log(`  .env file exists: ${require('fs').existsSync('./.env') ? '✅ Yes' : '❌ No'}\n`);

    console.log('💡 Common Fixes:');
    console.log('  1. Verify .env file has correct MONGO_URI');
    console.log('  2. Check MongoDB Atlas IP whitelist settings');
    console.log('  3. Ensure credentials are correct (no special characters)');
    console.log('  4. Restart the connection test after making changes\n');

    console.log('='.repeat(60) + '\n');

    process.exit(1);
  }
};

testDatabaseConnection();
