const cron = require('node-cron');
const logger = require('../config/logger');

const startReportSchedulerCron = () => {
  cron.schedule('0 9 * * 1', () => {
    logger.info('[Cron] Running weekly report dispatcher...');
    // Fetch statistics and email reports to managers/tenant admins
  });
};

module.exports = startReportSchedulerCron;
