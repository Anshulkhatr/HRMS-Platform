const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./common/middleware/rateLimit.middleware');
const tenantMiddleware = require('./common/middleware/tenant.middleware');
const { errorConverter, errorHandler } = require('./common/middleware/error.middleware');
const ApiError = require('./common/utils/ApiError');

// Routes
const authRoutes = require('./auth/routes/auth.routes');
const tenantRoutes = require('./tenant/routes/tenant.routes');
const userRoutes = require('./users/routes/user.routes');
const employeeRoutes = require('./employee/routes/employee.routes');
const attendanceRoutes = require('./attendance/routes/attendance.routes');
const leaveRoutes = require('./leave/routes/leave.routes');
const approvalRoutes = require('./approval/routes/approval.routes');
const documentRoutes = require('./document/routes/document.routes');
const dashboardRoutes = require('./dashboard/routes/dashboard.routes');
const auditRoutes = require('./audit/routes/audit.routes');
const notificationRoutes = require('./notification/routes/notification.routes');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Limit repeated requests to public APIs
app.use('/api', apiLimiter);

// Tenant context resolution
app.use(tenantMiddleware);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Send back 404 error for any unknown API request
app.use((req, res, next) => {
  next(new ApiError(404, 'API Route Not found'));
});

// Convert error to ApiError if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

module.exports = app;
