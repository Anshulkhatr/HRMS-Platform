const { connectDB, mongoose } = require('../config/db');
const Tenant = require('../tenant/models/tenant.model');
const User = require('../users/models/user.model');
const Employee = require('../employee/models/employee.model');

const rolesToSeed = [
  {
    email: 'superadmin@acme.com',
    role: 'SuperAdmin',
    firstName: 'Super',
    lastName: 'Admin',
    department: 'Executive',
    position: 'Chief Executive Officer',
  },
  {
    email: 'tenantadmin@acme.com',
    role: 'TenantAdmin',
    firstName: 'Tenant',
    lastName: 'Admin',
    department: 'IT Support',
    position: 'System Administrator',
  },
  {
    email: 'manager@acme.com',
    role: 'Manager',
    firstName: 'Manager',
    lastName: 'User',
    department: 'Engineering',
    position: 'Engineering Manager',
  },
  {
    email: 'employee@acme.com',
    role: 'Employee',
    firstName: 'John',
    lastName: 'Doe',
    department: 'Engineering',
    position: 'Software Engineer',
  }
];

const seed = async () => {
  try {
    await connectDB();

    // Check if Tenant already exists
    let tenant = await Tenant.findOne({ domain: 'acme.com' });
    if (!tenant) {
      tenant = await Tenant.create({
        name: 'Acme Corporation',
        domain: 'acme.com',
        status: 'active',
        plan: 'premium'
      });
      console.log('Created Tenant:', tenant.name, `(${tenant._id})`);
    } else {
      console.log('Tenant already exists:', tenant.name, `(${tenant._id})`);
    }

    for (const item of rolesToSeed) {
      // Check if User already exists
      let user = await User.findOne({ email: item.email });
      if (!user) {
        user = await User.create({
          email: item.email,
          password: 'password123',
          role: item.role,
          status: 'active',
          tenantId: tenant._id
        });
        console.log('Created User:', user.email, `(Role: ${user.role})`);
      } else {
        console.log('User already exists:', user.email);
      }

      // Check if Employee profile already exists
      let employee = await Employee.findOne({ userId: user._id });
      if (!employee) {
        employee = await Employee.create({
          userId: user._id,
          tenantId: tenant._id,
          firstName: item.firstName,
          lastName: item.lastName,
          department: item.department,
          position: item.position,
          joiningDate: new Date('2026-01-01'),
          status: 'active'
        });
        console.log('Created Employee Profile for:', employee.firstName, employee.lastName);
      } else {
        console.log('Employee Profile already exists for:', user.email);
      }
    }

    console.log('Employee seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
