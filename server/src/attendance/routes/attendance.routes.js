const express = require('express');
const attendanceController = require('../controllers/attendance.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const roleMiddleware = require('../../common/middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/clock-in', attendanceController.clockIn);
router.post('/clock-out', attendanceController.clockOut);
router.get('/my-attendance', attendanceController.getMyAttendance);
router.get('/', roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'), attendanceController.getAllAttendance);

module.exports = router;
