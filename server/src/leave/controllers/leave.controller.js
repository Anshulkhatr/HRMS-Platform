const leaveService = require('../services/leave.service');

class LeaveController {
  async requestLeave(req, res, next) {
    try {
      const leave = await leaveService.requestLeave(req.user.id, req.body, req.tenantId);
      res.status(201).json({
        success: true,
        data: leave,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyLeaves(req, res, next) {
    try {
      const leaves = await leaveService.getMyLeaves(req.user.id, req.tenantId);
      res.status(200).json({
        success: true,
        data: leaves,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllLeaves(req, res, next) {
    try {
      const { status } = req.query;
      const leaves = await leaveService.getAllLeaves(req.tenantId, status, req.user.role);
      res.status(200).json({
        success: true,
        data: leaves,
      });
    } catch (error) {
      next(error);
    }
  }

  async approveLeave(req, res, next) {
    try {
      const leave = await leaveService.updateLeaveStatus(req.params.id, 'Approved', req.user.id, req.tenantId);
      res.status(200).json({
        success: true,
        message: 'Leave approved successfully',
        data: leave,
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectLeave(req, res, next) {
    try {
      const leave = await leaveService.updateLeaveStatus(req.params.id, 'Rejected', req.user.id, req.tenantId);
      res.status(200).json({
        success: true,
        message: 'Leave rejected successfully',
        data: leave,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeaveController();
