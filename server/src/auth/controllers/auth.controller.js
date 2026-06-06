const authService = require('../services/auth.service');
const auditService = require('../../audit/services/audit.service');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, tenantName, domain, role } = req.body;
      const result = await authService.registerTenantAdmin(email, password, tenantName, domain, role);
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.user._id,
            email: result.user.email,
            role: result.user.role,
          },
          tenant: result.tenant,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      const employee = await require('../../employee/repositories/employee.repository').findByUserId(user._id, user.tenantId);
      const userResponse = {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      };
      if (employee) {
        userResponse.employeeProfile = employee;
        userResponse.name = `${employee.firstName} ${employee.lastName}`;
      } else {
        userResponse.name = user.email.split('@')[0];
      }
      
      await auditService.log(user._id, user.tenantId, 'USER_LOGIN', req.ip || '', `User logged in: ${user.email}`);

      res.status(200).json({
        success: true,
        token,
        user: userResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const employee = await require('../../employee/repositories/employee.repository').findByUserId(req.user.id, req.user.tenantId);
      const userResponse = { ...req.user };
      if (employee) {
        userResponse.employeeProfile = employee;
        userResponse.name = `${employee.firstName} ${employee.lastName}`;
      } else {
        userResponse.name = req.user.email.split('@')[0];
      }
      res.status(200).json({
        success: true,
        user: userResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
