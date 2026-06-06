const ApiError = require('../utils/ApiError');

const tenantMiddleware = (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
  req.tenantId = tenantId || null;
  next();
};

module.exports = tenantMiddleware;
