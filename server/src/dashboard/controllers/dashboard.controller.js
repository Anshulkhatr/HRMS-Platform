const Employee = require('../../employee/models/employee.model');
const Attendance = require('../../attendance/models/attendance.model');
const Leave = require('../../leave/models/leave.model');

class DashboardController {
  async getStats(req, res, next) {
    try {
      const tenantId = req.tenantId;
      const userRole = req.user.role;

      let employeeFilter = { tenantId };
      let attendanceFilter = { tenantId, status: { $in: ['Present', 'Late'] } };
      let leaveFilter = { tenantId, status: 'Pending' };

      // Get current date string for attendance check
      const todayStr = new Date().toISOString().split('T')[0];
      attendanceFilter.date = todayStr;

      if (userRole === 'Manager') {
        const User = require('../../users/models/user.model');
        const employeeUsers = await User.find({ tenantId, role: 'Employee' }).select('_id');
        const employeeUserIds = employeeUsers.map(u => u._id);

        employeeFilter.userId = { $in: employeeUserIds };

        const employeesList = await Employee.find({ userId: { $in: employeeUserIds } }).select('_id');
        const employeeIds = employeesList.map(e => e._id);

        attendanceFilter.employeeId = { $in: employeeIds };
        leaveFilter.employeeId = { $in: employeeIds };
      } else if (userRole === 'TenantAdmin') {
        // TenantAdmins can see Employees and Managers
        const User = require('../../users/models/user.model');
        const allowedUsers = await User.find({ tenantId, role: { $in: ['Employee', 'Manager'] } }).select('_id');
        const allowedUserIds = allowedUsers.map(u => u._id);

        employeeFilter.userId = { $in: allowedUserIds };

        const employeesList = await Employee.find({ userId: { $in: allowedUserIds } }).select('_id');
        const employeeIds = employeesList.map(e => e._id);

        attendanceFilter.employeeId = { $in: employeeIds };
        leaveFilter.employeeId = { $in: employeeIds };
      }

      // Aggregations
      const totalEmployees = await Employee.countDocuments(employeeFilter);
      const todayPresent = await Attendance.countDocuments(attendanceFilter);
      const pendingLeaves = await Leave.countDocuments(leaveFilter);

      // Dynamic Attendance Breakdown
      const presentCount = await Attendance.countDocuments({ ...attendanceFilter, status: 'Present' });
      const lateCount = await Attendance.countDocuments({ ...attendanceFilter, status: 'Late' });
      const onLeaveCount = await Attendance.countDocuments({ ...attendanceFilter, status: 'OnLeave' });
      const absentCount = Math.max(0, totalEmployees - (presentCount + lateCount + onLeaveCount));

      const presentPct = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;
      const latePct = totalEmployees > 0 ? Math.round((lateCount / totalEmployees) * 100) : 0;
      const onLeavePct = totalEmployees > 0 ? Math.round((onLeaveCount / totalEmployees) * 100) : 0;
      const absentPct = totalEmployees > 0 ? Math.max(0, 100 - (presentPct + latePct + onLeavePct)) : 100;

      const attendanceBreakdown = [
        { label: 'Present', pct: presentPct, color: '#10b981' },
        { label: 'Late', pct: latePct, color: '#f59e0b' },
        { label: 'Absent', pct: absentPct, color: '#ef4444' },
        { label: 'On Leave', pct: onLeavePct, color: '#6366f1' },
      ];

      // Dynamic Recent Activity
      // Grab 3 most recent employees and 3 most recent leaves
      const recentEmployees = await Employee.find(employeeFilter)
        .sort({ createdAt: -1 })
        .limit(3);
      
      const recentLeaves = await Leave.find(leaveFilter)
        .sort({ createdAt: -1 })
        .limit(3)
        .populate({
          path: 'employeeId',
          select: 'firstName lastName'
        });

      const activities = [];
      
      recentEmployees.forEach(emp => {
        activities.push({
          text: `New employee onboarded: ${emp.firstName} ${emp.lastName}`,
          time: new Date(emp.createdAt).toLocaleDateString() + ' ' + new Date(emp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: emp.createdAt,
          color: '#06b6d4'
        });
      });

      recentLeaves.forEach(leave => {
        const name = leave.employeeId ? `${leave.employeeId.firstName} ${leave.employeeId.lastName}` : 'Someone';
        activities.push({
          text: `Leave request from ${name} — ${leave.status}`,
          time: new Date(leave.createdAt).toLocaleDateString() + ' ' + new Date(leave.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: leave.createdAt,
          color: leave.status === 'Approved' ? '#10b981' : leave.status === 'Rejected' ? '#ef4444' : '#6366f1'
        });
      });

      // Sort activities descending by timestamp
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const recentActivity = activities.slice(0, 5);

      res.status(200).json({
        success: true,
        data: {
          totalEmployees,
          todayPresent,
          pendingLeaves,
          attendanceRate: totalEmployees > 0 ? Math.round((todayPresent / totalEmployees) * 100) : 0,
          attendanceBreakdown,
          recentActivity,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
