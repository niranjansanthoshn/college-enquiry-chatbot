const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.warn(`[MongoDB] Please ensure MongoDB is running at ${config.mongodbUri} or provide a valid MONGODB_URI in .env`);
    // In production we should exit, but in dev we let the server start with warning
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
