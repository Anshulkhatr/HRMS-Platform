const cron = require('node-cron');
const logger = require('../config/logger');

// Run at 00:00 on day-of-month 1
const startLeaveAccrualCron = () => {
  cron.schedule('0 0 1 * *', () => {
    logger.info('[Cron] Running monthly leave accrual job...');
    // In a real application, you would loop through all active employees
    // and increment their leave balance fields in the DB.
  });
};

module.exports = startLeaveAccrualCron;
