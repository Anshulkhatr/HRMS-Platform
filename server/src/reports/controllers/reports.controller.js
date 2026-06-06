const attendanceService = require('../../attendance/services/attendance.service');
const leaveService = require('../../leave/services/leave.service');

class ReportsController {
  async getAttendanceReport(req, res, next) {
    try {
      const records = await attendanceService.getAllAttendance(req.tenantId);
      
      // Simple CSV generation
      let csv = 'Employee ID,Date,Clock In,Clock Out,Status\n';
      records.forEach(r => {
        csv += `${r.employeeId?._id || r.employeeId},${r.date},${r.clockIn || ''},${r.clockOut || ''},${r.status}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.csv');
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }

  async getLeaveReport(req, res, next) {
    try {
      const records = await leaveService.getAllLeaves(req.tenantId);

      let csv = 'Employee ID,Start Date,End Date,Type,Status,Reason\n';
      records.forEach(r => {
        csv += `${r.employeeId?._id || r.employeeId},${r.startDate},${r.endDate},${r.type},${r.status},"${r.reason || ''}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leave_report.csv');
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportsController();
