const express = require('express');
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', notificationController.getMyNotifications);
router.put('/mark-all-read', notificationController.markAllRead);
router.put('/:id/read', notificationController.markOneRead);
router.delete('/clear-all', notificationController.deleteAllNotifications);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
