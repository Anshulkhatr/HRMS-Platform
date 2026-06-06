const express = require('express');
const employeeController = require('../controllers/employee.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const roleMiddleware = require('../../common/middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'), employeeController.registerEmployee);
router.get('/', roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'), employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployee);
router.put('/:id', roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'), employeeController.updateEmployee);
router.delete('/:id', roleMiddleware('SuperAdmin', 'TenantAdmin'), employeeController.deleteEmployee);

module.exports = router;
