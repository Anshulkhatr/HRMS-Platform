import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ allowedRoles = ['SuperAdmin', 'TenantAdmin'] }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Still loading user data — wait before making role-based decision
  if (loading || !user) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#070a13', flexDirection: 'column', gap: '16px'
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid rgba(99,102,241,0.1)', borderTopColor: '#6366f1',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    );
  }

  return allowedRoles.includes(user.role)
    ? <Outlet />
    : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;
