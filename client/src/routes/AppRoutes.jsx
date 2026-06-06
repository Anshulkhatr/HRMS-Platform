import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

import AdminLayout from '../layouts/AdminLayout';
import ManagerLayout from '../layouts/ManagerLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';

import AdminDashboard from '../pages/dashboard/AdminDashboard';
import ManagerDashboard from '../pages/dashboard/ManagerDashboard';
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard';

import EmployeeList from '../pages/employee/EmployeeList';
import AddEmployee from '../pages/employee/AddEmployee';
import EmployeeProfile from '../pages/employee/EmployeeProfile';

import AttendanceTable from '../pages/attendance/AttendanceTable';
import PunchInOut from '../pages/attendance/PunchInOut';
import AttendanceReport from '../pages/attendance/AttendanceReport';

import ApplyLeave from '../pages/leave/ApplyLeave';
import LeaveBalance from '../pages/leave/LeaveBalance';
import LeaveHistory from '../pages/leave/LeaveHistory';
import LeaveApproval from '../pages/leave/LeaveApproval';

import PendingApprovals from '../pages/approvals/PendingApprovals';

import MyProfile from '../pages/profile/MyProfile';
import Documents from '../pages/document/Documents';
import NotificationCenter from '../pages/notifications/NotificationCenter';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, color: '#f3f4f6', backgroundColor: '#070a13' }}>
          <h2 style={{ fontSize: 48, fontWeight: 800 }}>403</h2>
          <p style={{ color: '#9ca3af' }}>You don't have permission to access this page.</p>
        </div>
      } />

      {/* Employee Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="attendance" element={<PunchInOut />} />
          <Route path="leaves" element={<ApplyLeave />} />
          <Route path="leave-balance" element={<LeaveBalance />} />
          <Route path="leave-history" element={<LeaveHistory />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="documents" element={<Documents />} />
          <Route path="notifications" element={<NotificationCenter />} />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="employees/:id" element={<EmployeeProfile />} />
          <Route path="attendance" element={<AttendanceTable />} />
          <Route path="leaves" element={<LeaveApproval />} />
          <Route path="approvals" element={<PendingApprovals />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="documents" element={<Documents />} />
          <Route path="notifications" element={<NotificationCenter />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute allowedRoles={['SuperAdmin', 'TenantAdmin']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/:id" element={<EmployeeProfile />} />
            <Route path="attendance" element={<AttendanceTable />} />
            <Route path="attendance/report" element={<AttendanceReport />} />
            <Route path="leaves" element={<LeaveApproval />} />
            <Route path="approvals" element={<PendingApprovals />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="documents" element={<Documents />} />
            <Route path="notifications" element={<NotificationCenter />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
