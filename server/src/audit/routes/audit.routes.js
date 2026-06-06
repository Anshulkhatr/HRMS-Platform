const express = require('express');
const AuditLog = require('../models/audit.model');
const authMiddleware = require('../../common/middleware/auth.middleware');
const roleMiddleware = require('../../common/middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('SuperAdmin', 'TenantAdmin'));

router.get('/', async (req, res, next) => {
  try {
    const logs = await AuditLog.find(req.tenantId ? { tenantId: req.tenantId } : {}).populate('userId', 'email');
    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
