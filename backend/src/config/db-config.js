const mongoose = require('mongoose');
const {DB_URI} = require('./env-variables');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(DB_URI);
    console.log('MongoDB Connected:', connection.connection.host);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;