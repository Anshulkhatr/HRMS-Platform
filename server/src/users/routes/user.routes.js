const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../../common/middleware/auth.middleware');
const roleMiddleware = require('../../common/middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', roleMiddleware('SuperAdmin', 'TenantAdmin'), userController.createUser);
router.get('/', roleMiddleware('SuperAdmin', 'TenantAdmin', 'Manager'), userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', roleMiddleware('SuperAdmin', 'TenantAdmin'), userController.updateUser);
router.delete('/:id', roleMiddleware('SuperAdmin', 'TenantAdmin'), userController.deleteUser);

module.exports = router;
