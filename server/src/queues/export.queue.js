const { Queue } = require('bullmq');
const redisClient = require('../config/redis');
const logger = require('../config/logger');

let exportQueue;

try {
  exportQueue = new Queue('ExportQueue', {
    connection: redisClient,
  });
} catch (error) {
  logger.error('Failed to initialize Export Queue:', error);
}

module.exports = exportQueue;
