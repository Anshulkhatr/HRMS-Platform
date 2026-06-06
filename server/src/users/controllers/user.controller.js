const userService = require('../services/user.service');

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body, req.tenantId);
      res.status(201).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id, req.tenantId);
      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
          tenantId: user.tenantId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers(req.tenantId, req.user.role);
      res.status(200).json({
        success: true,
        data: users.map(user => ({
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body, req.tenantId);
      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id, req.tenantId);
      res.status(200).json({
        success: true,
        message: 'User successfully deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
