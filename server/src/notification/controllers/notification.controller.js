const notificationService = require('../services/notification.service');

class NotificationController {
  async getMyNotifications(req, res, next) {
    try {
      const notifications = await notificationService.getForUser(req.user.id);
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  }

  async markAllRead(req, res, next) {
    try {
      await notificationService.markAllRead(req.user.id);
      res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }

  async markOneRead(req, res, next) {
    try {
      const notif = await notificationService.markOneRead(req.params.id, req.user.id);
      res.status(200).json({ success: true, data: notif });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      await notificationService.delete(req.params.id, req.user.id);
      res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error) {
      next(error);
    }
  }

  async deleteAllNotifications(req, res, next) {
    try {
      await notificationService.deleteAll(req.user.id);
      res.status(200).json({ success: true, message: 'All notifications cleared' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
