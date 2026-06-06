const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  domain: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'trial'],
    default: 'active',
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Tenant', tenantSchema);
