const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');
const logger = require('./config/logger');

// Import cron jobs
const startLeaveAccrualCron = require('./cron/leaveAccrual.cron');
const startAttendanceSyncCron = require('./cron/attendanceSync.cron');
const startReportSchedulerCron = require('./cron/reportScheduler.cron');

const startServer = async () => {
  // Connect to MongoDB Database
  await connectDB();

  // Start Cron Jobs
  startLeaveAccrualCron();
  startAttendanceSyncCron();
  startReportSchedulerCron();

  // Start Express Server Listener
  const server = app.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port} in ${config.env} mode.`);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error('Unexpected error:', error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, closing server...');
    if (server) {
      server.close();
    }
  });
};

startServer();
