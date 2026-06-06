const employeeService = require('../services/employee.service');

class EmployeeController {
  async registerEmployee(req, res, next) {
    try {
      const employee = await employeeService.registerEmployee(req.body, req.tenantId, req.user.role);
      res.status(201).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployee(req, res, next) {
    try {
      const employee = await employeeService.getEmployeeById(req.params.id, req.tenantId);
      res.status(200).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllEmployees(req, res, next) {
    try {
      const employees = await employeeService.getAllEmployees(req.tenantId, req.user.role);
      res.status(200).json({
        success: true,
        data: employees,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const employee = await employeeService.updateEmployee(req.params.id, req.body, req.tenantId);
      res.status(200).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      await employeeService.deleteEmployee(req.params.id, req.tenantId);
      res.status(200).json({
        success: true,
        message: 'Employee profile successfully deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();
