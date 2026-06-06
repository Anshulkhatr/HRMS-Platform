const leaveService = require('../../leave/services/leave.service');

class ApprovalController {
  async getPendingApprovals(req, res, next) {
    try {
      // Return pending leave requests as the primary approval type
      const pendingLeaves = await leaveService.getAllLeaves(req.tenantId, 'Pending');
      res.status(200).json({
        success: true,
        data: pendingLeaves,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ApprovalController();
