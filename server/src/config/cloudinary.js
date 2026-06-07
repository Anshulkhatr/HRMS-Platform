const cloudinary = require('cloudinary').v2;
const config = require('./env');
const logger = require('./logger');

if (config.cloudinary.cloudName && config.cloudinary.apiKey) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    timeout: 10000, // 10 seconds timeout limit
  });
  logger.info('Cloudinary configured successfully.');
} else {
  logger.warn('Cloudinary config missing. File uploads will default to local storage or dummy response.');
}

module.exports = cloudinary;
