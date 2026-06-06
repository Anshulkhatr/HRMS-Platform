const mongoose = require('mongoose');
const config = require('./env');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.url);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Unable to connect to MongoDB: ${error.message}`);
    if (config.env === 'production') {
      process.exit(1);
    }
  }
};

module.exports = {
  connectDB,
  mongoose,
};
