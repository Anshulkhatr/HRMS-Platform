import React from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Shield, Briefcase, Calendar, Info, Clock } from 'lucide-react';

const MyProfile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Check if there is employee details (for non-Admin roles)
  const employee = user.employeeProfile || null;

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }} className="animate-slide">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }} className="text-gradient">My Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage and view your personal profile and employment details</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', md: '1fr 2fr', gap: '24px' }}>
        {/* Main User Info Card */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '16px',
            fontSize: '36px',
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>{user.email}</p>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--primary)',
            fontSize: '14px',
            fontWeight: 600,
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <Shield size={14} />
            {user.role === 'TenantAdmin' ? 'HR - Manager' : user.role}
          </span>
        </div>

        {/* Detailed Info Profile Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Account Details */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} style={{ color: 'var(--primary)' }} />
              Account Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', sm: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Full Name</label>
                <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>
                  {user.name}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email Address</label>
                <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Employee Details (if applicable) */}
          {employee && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} style={{ color: 'var(--secondary)' }} />
                Employment Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', sm: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Department</label>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>
                    {employee.department}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Phone Number</label>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>
                    {employee.phoneNumber || 'N/A'}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Job Title / Position</label>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>
                    {employee.position}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Joining Date</label>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>
                    {new Date(employee.joiningDate).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Employment Status</label>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontWeight: 500, textTransform: 'capitalize' }}>
                    {employee.status}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
