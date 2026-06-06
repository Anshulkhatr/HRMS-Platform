const userRepository = require('../repositories/user.repository');
const ApiError = require('../../common/utils/ApiError');

class UserService {
  async createUser(userData, tenantId) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(400, 'Email is already registered');
    }
    return userRepository.create({ ...userData, tenantId });
  }

  async getUserById(id, tenantId) {
    const user = await userRepository.findById(id);
    if (!user || (tenantId && String(user.tenantId) !== String(tenantId))) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  async getAllUsers(tenantId, currentUserRole) {
    const users = await userRepository.findAll(tenantId);
    if (currentUserRole === 'Manager') {
      return users.filter(user => user.role === 'Employee');
    }
    if (currentUserRole === 'TenantAdmin') {
      return users.filter(user => user.role === 'Employee' || user.role === 'Manager');
    }
    return users;
  }

  async updateUser(id, updateData, tenantId) {
    const user = await this.getUserById(id, tenantId);
    Object.assign(user, updateData);
    return user.save();
  }

  async deleteUser(id, tenantId) {
    const user = await this.getUserById(id, tenantId);
    await user.deleteOne();
    return true;
  }
}

module.exports = new UserService();
