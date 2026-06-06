const AuditLog = require('../models/audit.model');
const logger = require('../../config/logger');

class AuditService {
  async log(userId, tenantId, action, ipAddress, details) {
    try {
      await AuditLog.create({
        userId,
        tenantId,
        action,
        ipAddress,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
      });
    } catch (error) {
      logger.error('Failed to write audit log:', error);
    }
  }
}

module.exports = new AuditService();
