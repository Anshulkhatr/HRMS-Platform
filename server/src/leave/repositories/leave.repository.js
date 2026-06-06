const Leave = require('../models/leave.model');

class LeaveRepository {
  async create(leaveData) {
    return Leave.create(leaveData);
  }

  async findById(id, tenantId) {
    const filter = { _id: id };
    if (tenantId) filter.tenantId = tenantId;
    return Leave.findOne(filter).populate({
      path: 'employeeId',
      populate: { path: 'userId', select: 'email role' }
    });
  }

  async findAllByEmployee(employeeId, tenantId) {
    const filter = { employeeId };
    if (tenantId) filter.tenantId = tenantId;
    return Leave.find(filter);
  }

  async findAll(tenantId, status) {
    const filter = {};
    if (tenantId) filter.tenantId = tenantId;
    if (status) filter.status = status;
    return Leave.find(filter).populate({
      path: 'employeeId',
      populate: { path: 'userId', select: 'email role' }
    });
  }

  async update(id, updateData, tenantId) {
    const filter = { _id: id };
    if (tenantId) filter.tenantId = tenantId;
    return Leave.findOneAndUpdate(filter, updateData, { new: true });
  }
}

module.exports = new LeaveRepository();
