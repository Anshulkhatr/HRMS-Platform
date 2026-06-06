const employeeRepository = require('../repositories/employee.repository');
const userRepository = require('../../users/repositories/user.repository');
const ApiError = require('../../common/utils/ApiError');
const notificationService = require('../../notification/services/notification.service');
const auditService = require('../../audit/services/audit.service');

class EmployeeService {
  async registerEmployee(employeeData, tenantId, currentUserRole) {
    let userId = employeeData.userId;
    let targetRole = employeeData.role || 'Employee';

    // If linking an existing user, check their role
    if (userId) {
      const targetUser = await userRepository.findById(userId);
      if (targetUser) {
        targetRole = targetUser.role;
      }
    }

    // Role creation validation
    if (currentUserRole === 'Manager' && targetRole !== 'Employee') {
      throw new ApiError(403, 'Managers can only register Employee accounts');
    }
    if (currentUserRole === 'TenantAdmin' && !['Employee', 'Manager'].includes(targetRole)) {
      throw new ApiError(403, 'Tenant Administrators can only register Employee or Manager accounts');
    }

    // Auto-create user account if email is provided instead of userId
    if (!userId && employeeData.email) {
      const existingUser = await userRepository.findByEmail(employeeData.email);
      if (existingUser) {
        throw new ApiError(400, 'Email is already registered');
      }
      const newUser = await userRepository.create({
        email: employeeData.email,
        password: employeeData.password || 'password123',
        role: targetRole,
        status: 'active',
        tenantId,
      });
      userId = newUser._id;
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User associated with employee not found');
    }

    if (tenantId && String(user.tenantId) !== String(tenantId)) {
      throw new ApiError(403, 'User does not belong to this tenant');
    }

    const existingEmployee = await employeeRepository.findByUserId(userId, tenantId);
    if (existingEmployee) {
      throw new ApiError(400, 'Employee profile already exists for this user');
    }

    const employee = await employeeRepository.create({ ...employeeData, userId, tenantId });

    // Send a welcome notification to the new user
    await notificationService.create(
      userId,
      tenantId,
      'Welcome to HRMS Platform!',
      `Your account has been set up. You have been added to the ${employee.department} department as ${employee.position}.`,
      'success'
    );

    await auditService.log(userId, tenantId, 'EMPLOYEE_REGISTER', '', `Employee registered: ${employee.firstName} ${employee.lastName} (${employee.position})`);

    return employee;
  }

  async getEmployeeById(id, tenantId) {
    const employee = await employeeRepository.findById(id, tenantId);
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }
    return employee;
  }

  async getAllEmployees(tenantId, currentUserRole) {
    const employees = await employeeRepository.findAll(tenantId);
    if (currentUserRole === 'Manager') {
      return employees.filter(emp => emp.userId && emp.userId.role === 'Employee');
    }
    if (currentUserRole === 'TenantAdmin') {
      return employees.filter(emp => emp.userId && (emp.userId.role === 'Employee' || emp.userId.role === 'Manager'));
    }
    return employees;
  }

  async updateEmployee(id, updateData, tenantId) {
    const employee = await employeeRepository.update(id, updateData, tenantId);
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }
    await auditService.log(employee.userId, tenantId, 'EMPLOYEE_UPDATE', '', `Employee profile updated: ${employee.firstName} ${employee.lastName}`);
    return employee;
  }

  async deleteEmployee(id, tenantId) {
    const success = await employeeRepository.delete(id, tenantId);
    if (!success) {
      throw new ApiError(404, 'Employee profile not found');
    }
    await auditService.log(id, tenantId, 'EMPLOYEE_DELETE', '', `Employee profile deleted`);
    return true;
  }
}

module.exports = new EmployeeService();
