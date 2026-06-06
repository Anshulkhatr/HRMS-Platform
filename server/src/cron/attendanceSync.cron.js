const cron = require('node-cron');
const logger = require('../config/logger');

// Run daily at 23:59
const startAttendanceSyncCron = () => {
  cron.schedule('59 23 * * *', () => {
    logger.info('[Cron] Running daily attendance sync job...');
    // In a real application, you would find all active employees without attendance for today
    // and create an 'Absent' record for them.
  });
};

module.exports = startAttendanceSyncCron;
