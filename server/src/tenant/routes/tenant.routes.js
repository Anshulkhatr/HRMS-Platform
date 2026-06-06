const express = require('express');
const tenantController = require('../controllers/tenant.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const roleMiddleware = require('../../common/middleware/role.middleware');

const router = express.Router();

router.post('/', tenantController.createTenant);
router.get('/', authMiddleware, roleMiddleware('SuperAdmin'), tenantController.getAllTenants);
router.get('/:id', authMiddleware, tenantController.getTenant);
router.put('/:id', authMiddleware, roleMiddleware('SuperAdmin', 'TenantAdmin'), tenantController.updateTenant);

module.exports = router;
