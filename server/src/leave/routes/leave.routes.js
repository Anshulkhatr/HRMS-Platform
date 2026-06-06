const express = require('express');
const leaveController = require('../controllers/leave.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const roleMiddleware = require('../../common/middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', leaveController.requestLeave);
router.get('/my-leaves', leaveController.getMyLeaves);
router.get('/', roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'), leaveController.getAllLeaves);
router.put('/:id/approve', roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'), leaveController.approveLeave);
router.put('/:id/reject', roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'), leaveController.rejectLeave);

module.exports = router;
