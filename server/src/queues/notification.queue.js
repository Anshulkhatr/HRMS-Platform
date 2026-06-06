const { Queue, Worker } = require('bullmq');
const redisClient = require('../config/redis');
const notificationService = require('../notification/services/notification.service');
const logger = require('../config/logger');

let notificationQueue;
let worker;

try {
  notificationQueue = new Queue('NotificationQueue', {
    connection: redisClient,
  });

  worker = new Worker('NotificationQueue', async (job) => {
    logger.info(`[Worker] Processing notification job: ${job.id}`);
    const { to, subject, body, type } = job.data;

    if (type === 'email') {
      await notificationService.sendEmail(to, subject, body);
    } else if (type === 'sms') {
      await notificationService.sendSMS(to, body);
    }
  }, {
    connection: redisClient,
  });

  worker.on('completed', (job) => {
    logger.info(`Notification job ${job.id} completed!`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Notification job ${job?.id} failed: ${err.message}`);
  });
} catch (error) {
  logger.error('Failed to initialize Notification Queue/Worker:', error);
}

module.exports = {
  notificationQueue,
  addNotificationJob: async (data) => {
    if (notificationQueue) {
      return notificationQueue.add('sendNotification', data);
    } else {
      logger.warn('Notification queue not active. Falling back to sync notify.');
      if (data.type === 'email') {
        return notificationService.sendEmail(data.to, data.subject, data.body);
      }
    }
  }
};
