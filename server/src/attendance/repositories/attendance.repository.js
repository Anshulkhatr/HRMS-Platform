const Attendance = require('../models/attendance.model');

class AttendanceRepository {
  async create(attendanceData) {
    return Attendance.create(attendanceData);
  }

  async findByEmployeeAndDate(employeeId, date, tenantId) {
    const filter = { employeeId, date };
    if (tenantId) filter.tenantId = tenantId;
    return Attendance.findOne(filter);
  }

  async findAllByEmployee(employeeId, tenantId) {
    const filter = { employeeId };
    if (tenantId) filter.tenantId = tenantId;
    return Attendance.find(filter);
  }

  async findAll(tenantId, date) {
    const filter = {};
    if (tenantId) filter.tenantId = tenantId;
    if (date) filter.date = date;
    return Attendance.find(filter).populate('employeeId');
  }

  async update(id, updateData, tenantId) {
    const filter = { _id: id };
    if (tenantId) filter.tenantId = tenantId;
    return Attendance.findOneAndUpdate(filter, updateData, { new: true });
  }
}

module.exports = new AttendanceRepository();
