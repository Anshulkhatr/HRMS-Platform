const express = require('express');
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../../common/middleware/rateLimit.middleware');
const authMiddleware = require('../../common/middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authLimiter, authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
