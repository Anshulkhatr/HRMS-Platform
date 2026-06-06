const nodemailer = require('nodemailer');
const config = require('../../config/env');
const logger = require('../../config/logger');
const Notification = require('../models/notification.model');

let transporter;
const initializeTransporter = async () => {
  if (config.email.smtp.host && config.email.smtp.auth.user && config.email.smtp.auth.user !== 'test_user') {
    transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.port === 465,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });

    transporter.verify((error) => {
      if (error) {
        logger.error('SMTP connection configuration error:', error);
      } else {
        logger.info('SMTP server connection established successfully');
      }
    });
  } else {
    logger.info('SMTP credentials not configured or using placeholders. Initializing working Ethereal SMTP test account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info(`Ethereal SMTP test account initialized! User: ${testAccount.user}`);
      logger.info('You can preview sent emails at https://ethereal.email');
    } catch (err) {
      logger.error('Failed to create Ethereal SMTP test account:', err);
    }
  }
};

initializeTransporter();

class NotificationService {
  async create(userId, tenantId, title, message, type = 'info') {
    const notification = await Notification.create({ userId, tenantId, title, message, type });
    try {
      const userRepository = require('../../users/repositories/user.repository');
      const user = await userRepository.findById(userId);
      if (user && user.email) {
        this.sendEmail(user.email, title, message).catch((err) => {
          logger.error(`Failed to send email notification to ${user.email}:`, err);
        });
      }
    } catch (error) {
      logger.error('Error fetching user for email notification:', error);
    }
    return notification;
  }

  async getForUser(userId) {
    return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
  }

  async markAllRead(userId) {
    return Notification.updateMany({ userId, read: false }, { read: true });
  }

  async markOneRead(notifId, userId) {
    return Notification.findOneAndUpdate({ _id: notifId, userId }, { read: true }, { new: true });
  }

  async delete(notifId, userId) {
    return Notification.findOneAndDelete({ _id: notifId, userId });
  }

  async deleteAll(userId) {
    return Notification.deleteMany({ userId });
  }

  async sendEmail(to, subject, body) {
    try {
      if (transporter) {
        const mailOptions = {
          from: config.email.from,
          to,
          subject,
          text: body,
          html: body.replace(/\n/g, '<br>'),
        };
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully: ${info.messageId}`);
        return info;
      } else {
        logger.info(`[Mock Email] To: ${to} | Subject: ${subject} | Body: ${body}`);
      }
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  async sendSMS(to, body) {
    logger.info(`[Mock SMS] To: ${to} | Body: ${body}`);
  }
}

module.exports = new NotificationService();
