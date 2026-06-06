const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true,
  },
  clockIn: {
    type: Date,
    default: null,
  },
  clockOut: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'OnLeave', 'HalfDay'],
    default: 'Absent',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Attendance', attendanceSchema);
