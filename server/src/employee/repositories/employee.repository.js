const Employee = require('../models/employee.model');
const mongoose = require('mongoose');

class EmployeeRepository {
  async create(employeeData) {
    return Employee.create(employeeData);
  }

  async findById(id, tenantId) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const filter = { _id: id };
    if (tenantId) filter.tenantId = tenantId;
    return Employee.findOne(filter).populate('userId', 'email role status');
  }

  async findByUserId(userId, tenantId) {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }
    const filter = { userId };
    if (tenantId) filter.tenantId = tenantId;
    return Employee.findOne(filter);
  }

  async findAll(tenantId) {
    const filter = tenantId ? { tenantId } : {};
    return Employee.find(filter).populate('userId', 'email role status');
  }

  async update(id, updateData, tenantId) {
    const filter = { _id: id };
    if (tenantId) filter.tenantId = tenantId;
    return Employee.findOneAndUpdate(filter, updateData, { new: true });
  }

  async delete(id, tenantId) {
    const filter = { _id: id };
    if (tenantId) filter.tenantId = tenantId;
    const result = await Employee.findOneAndDelete(filter);
    return !!result;
  }
}

module.exports = new EmployeeRepository();
