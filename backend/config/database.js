const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose
 * Supports both local MongoDB and MongoDB Atlas
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/DeliverX';
    const nodeEnv = process.env.NODE_ENV || 'development';

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoURI, options);

    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Database: DeliverX | Environment: ${nodeEnv}`);

    // Connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('   Error:', error.message);
    console.error('\n📌 Troubleshooting:');
    console.error('   1. Verify MONGO_URI in .env file');
    console.error('   2. If using MongoDB Atlas:');
    console.error('      - Add your IP to the IP Whitelist');
    console.error('      - Go to: https://www.mongodb.com/docs/atlas/security-whitelist/');
    console.error('      - Current URI:', process.env.MONGO_URI ? 'Set in .env' : 'Not set - using default');
    console.error('\n   3. If using local MongoDB:');
    console.error('      - Ensure MongoDB is running (mongod)');
    console.error('      - Default: mongodb://localhost:27017/DeliverX\n');
    
    process.exit(1);
  }
};

module.exports = { connectDB };
