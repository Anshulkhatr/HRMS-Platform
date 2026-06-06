const leaveRepository = require('../repositories/leave.repository');
const employeeRepository = require('../../employee/repositories/employee.repository');
const ApiError = require('../../common/utils/ApiError');
const notificationService = require('../../notification/services/notification.service');

class LeaveService {
  async requestLeave(userId, leaveData, tenantId) {
    const employee = await employeeRepository.findByUserId(userId, tenantId);
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }

    const leave = await leaveRepository.create({
      ...leaveData,
      employeeId: employee._id,
      tenantId,
      status: 'Pending',
    });

    // Notify the employee that the leave request was submitted
    await notificationService.create(
      userId,
      tenantId,
      'Leave Request Submitted',
      `Your ${leave.type} leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been submitted and is pending approval.`,
      'info'
    );

    return leave;
  }

  async getMyLeaves(userId, tenantId) {
    const employee = await employeeRepository.findByUserId(userId, tenantId);
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }
    return leaveRepository.findAllByEmployee(employee._id, tenantId);
  }

  async getAllLeaves(tenantId, status, currentUserRole) {
    const leaves = await leaveRepository.findAll(tenantId, status);
    if (currentUserRole === 'Manager') {
      return leaves.filter(l => l.employeeId && l.employeeId.userId && l.employeeId.userId.role === 'Employee');
    }
    if (currentUserRole === 'TenantAdmin') {
      return leaves.filter(l => l.employeeId && l.employeeId.userId && ['Employee', 'Manager'].includes(l.employeeId.userId.role));
    }
    return leaves;
  }

  async updateLeaveStatus(leaveId, status, approverId, tenantId) {
    const leave = await leaveRepository.findById(leaveId, tenantId);
    if (!leave) {
      throw new ApiError(404, 'Leave request not found');
    }

    if (leave.status !== 'Pending') {
      throw new ApiError(400, `Leave request has already been ${leave.status.toLowerCase()}`);
    }

    leave.status = status;
    leave.approvedBy = approverId;
    const saved = await leave.save();

    // Notify the employee
    if (leave.employeeId && leave.employeeId.userId) {
      const empUserId = leave.employeeId.userId._id || leave.employeeId.userId;
      const isApproved = status === 'Approved';
      await notificationService.create(
        empUserId,
        tenantId,
        `Leave ${status}`,
        `Your ${leave.type} leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been ${status.toLowerCase()}.`,
        isApproved ? 'success' : 'error'
      );
    }

    return saved;
  }
}

module.exports = new LeaveService();
