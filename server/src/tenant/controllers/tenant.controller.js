const tenantService = require('../services/tenant.service');

class TenantController {
  async createTenant(req, res, next) {
    try {
      const tenant = await tenantService.registerTenant(req.body);
      res.status(201).json({
        success: true,
        data: tenant,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTenant(req, res, next) {
    try {
      const tenant = await tenantService.getTenant(req.params.id);
      res.status(200).json({
        success: true,
        data: tenant,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllTenants(req, res, next) {
    try {
      const tenants = await tenantService.getAllTenants();
      res.status(200).json({
        success: true,
        data: tenants,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTenant(req, res, next) {
    try {
      const tenant = await tenantService.updateTenant(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: tenant,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TenantController();
