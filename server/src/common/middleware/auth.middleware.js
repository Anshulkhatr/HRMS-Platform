const jwt = require('jsonwebtoken');
const config = require('../../config/env');
const ApiError = require('../utils/ApiError');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(401, 'Please authenticate'));
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, config.jwt.secret);

    req.user = {
      id: payload.sub || payload.id,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
    };

    if (req.tenantId && req.user.tenantId && req.tenantId !== req.user.tenantId) {
      return next(new ApiError(403, 'Forbidden access to this tenant'));
    }
    
    if (!req.tenantId) {
      req.tenantId = req.user.tenantId;
    }

    next();
  } catch (error) {
    next(new ApiError(401, 'Unauthorized/Invalid token'));
  }
};

module.exports = authMiddleware;
