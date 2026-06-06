const jwt = require('jsonwebtoken');
const userRepository = require('../../users/repositories/user.repository');
const tenantRepository = require('../../tenant/repositories/tenant.repository');
const config = require('../../config/env');
const ApiError = require('../../common/utils/ApiError');

class AuthService {
  async registerTenantAdmin(email, password, tenantName, domain, role = 'TenantAdmin') {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'Email is already registered');
    }

    const tenant = await tenantRepository.create({
      name: tenantName,
      domain,
      status: 'active',
    });

    const user = await userRepository.create({
      email,
      password,
      role: role || 'TenantAdmin',
      status: 'active',
      tenantId: tenant._id,
    });

    return { user, tenant };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Incorrect email or password');
    }

    if (user.status !== 'active') {
      throw new ApiError(401, 'User account is not active');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  generateToken(user) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }
}

module.exports = new AuthService();
