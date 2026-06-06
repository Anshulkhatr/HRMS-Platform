const attendanceService = require('../services/attendance.service');

class AttendanceController {
  async clockIn(req, res, next) {
    try {
      const record = await attendanceService.clockIn(req.user.id, req.tenantId);
      res.status(200).json({
        success: true,
        message: 'Successfully clocked in',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  }

  async clockOut(req, res, next) {
    try {
      const record = await attendanceService.clockOut(req.user.id, req.tenantId);
      res.status(200).json({
        success: true,
        message: 'Successfully clocked out',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyAttendance(req, res, next) {
    try {
      const records = await attendanceService.getMyAttendance(req.user.id, req.tenantId);
      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAttendance(req, res, next) {
    try {
      const { date } = req.query;
      const records = await attendanceService.getAllAttendance(req.tenantId, date);
      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AttendanceController();
