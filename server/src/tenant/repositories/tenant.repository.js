const Tenant = require('../models/tenant.model');

class TenantRepository {
  async create(tenantData) {
    return Tenant.create(tenantData);
  }

  async findById(id) {
    return Tenant.findById(id);
  }

  async findByDomain(domain) {
    return Tenant.findOne({ domain });
  }

  async findAll() {
    return Tenant.find({});
  }

  async update(id, updateData) {
    return Tenant.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    const result = await Tenant.findByIdAndDelete(id);
    return !!result;
  }
}

module.exports = new TenantRepository();
