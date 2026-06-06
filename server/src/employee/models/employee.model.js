const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  salary: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'terminated', 'on-leave'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Employee', employeeSchema);
