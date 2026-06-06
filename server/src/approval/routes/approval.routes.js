const express = require('express');
const approvalController = require('../controllers/approval.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const roleMiddleware = require('../../common/middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/pending', roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'), approvalController.getPendingApprovals);

module.exports = router;
