const tenantRepository = require('../repositories/tenant.repository');
const ApiError = require('../../common/utils/ApiError');

class TenantService {
  async registerTenant(tenantData) {
    if (tenantData.domain) {
      const existingTenant = await tenantRepository.findByDomain(tenantData.domain);
      if (existingTenant) {
        throw new ApiError(400, 'Domain is already registered');
      }
    }
    return tenantRepository.create(tenantData);
  }

  async getTenant(id) {
    const tenant = await tenantRepository.findById(id);
    if (!tenant) {
      throw new ApiError(404, 'Tenant not found');
    }
    return tenant;
  }

  async getAllTenants() {
    return tenantRepository.findAll();
  }

  async updateTenant(id, updateData) {
    const tenant = await tenantRepository.update(id, updateData);
    if (!tenant) {
      throw new ApiError(404, 'Tenant not found');
    }
    return tenant;
  }
}

module.exports = new TenantService();
