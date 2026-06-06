const User = require('../models/user.model');
const mongoose = require('mongoose');

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findById(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findAll(tenantId) {
    const filter = tenantId ? { tenantId } : {};
    return User.find(filter);
  }

  async update(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
}

module.exports = new UserRepository();
