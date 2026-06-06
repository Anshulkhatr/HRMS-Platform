const { Queue } = require('bullmq');
const redisClient = require('../config/redis');
const logger = require('../config/logger');

let payrollQueue;

try {
  payrollQueue = new Queue('PayrollQueue', {
    connection: redisClient,
  });
} catch (error) {
  logger.error('Failed to initialize Payroll Queue:', error);
}

module.exports = payrollQueue;
