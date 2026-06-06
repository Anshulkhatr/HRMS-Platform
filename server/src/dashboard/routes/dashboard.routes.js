const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const roleMiddleware = require('../../common/middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/stats', roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'), dashboardController.getStats);

module.exports = router;
