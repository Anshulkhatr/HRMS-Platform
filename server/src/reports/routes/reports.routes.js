const express = require('express');
const reportsController = require('../controllers/reports.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const roleMiddleware = require('../../common/middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'));

router.get('/attendance', reportsController.getAttendanceReport);
router.get('/leaves', reportsController.getLeaveReport);

module.exports = router;
