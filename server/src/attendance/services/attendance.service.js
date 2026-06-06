const attendanceRepository = require('../repositories/attendance.repository');
const employeeRepository = require('../../employee/repositories/employee.repository');
const ApiError = require('../../common/utils/ApiError');

class AttendanceService {
  async clockIn(userId, tenantId) {
    const employee = await employeeRepository.findByUserId(userId, tenantId);
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found for this user');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let record = await attendanceRepository.findByEmployeeAndDate(employee._id, todayStr, tenantId);

    if (record && record.clockIn) {
      throw new ApiError(400, 'Already clocked in for today');
    }

    const clockInTime = new Date();
    // Example rule: Late if clocked in after 09:30 AM
    const minutes = clockInTime.getHours() * 60 + clockInTime.getMinutes();
    const status = minutes > (9 * 60 + 30) ? 'Late' : 'Present';

    if (record) {
      record.clockIn = clockInTime;
      record.status = status;
      return record.save();
    } else {
      return attendanceRepository.create({
        employeeId: employee._id,
        tenantId,
        date: todayStr,
        clockIn: clockInTime,
        status,
      });
    }
  }

  async clockOut(userId, tenantId) {
    const employee = await employeeRepository.findByUserId(userId, tenantId);
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const record = await attendanceRepository.findByEmployeeAndDate(employee._id, todayStr, tenantId);

    if (!record || !record.clockIn) {
      throw new ApiError(400, 'Must clock in before clocking out');
    }

    if (record.clockOut) {
      throw new ApiError(400, 'Already clocked out for today');
    }

    record.clockOut = new Date();
    return record.save();
  }

  async getMyAttendance(userId, tenantId) {
    const employee = await employeeRepository.findByUserId(userId, tenantId);
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }
    return attendanceRepository.findAllByEmployee(employee._id, tenantId);
  }

  async getAllAttendance(tenantId, date) {
    return attendanceRepository.findAll(tenantId, date);
  }
}

module.exports = new AttendanceService();
