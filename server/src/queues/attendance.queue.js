const { Queue } = require('bullmq');
const redisClient = require('../config/redis');
const logger = require('../config/logger');

let attendanceQueue;

try {
  attendanceQueue = new Queue('AttendanceQueue', {
    connection: redisClient,
  });
} catch (error) {
  logger.error('Failed to initialize Attendance Queue:', error);
}

module.exports = attendanceQueue;
