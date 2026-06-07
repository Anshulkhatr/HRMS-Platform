import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Users, Clock, CalendarDays, CheckSquare,
  BarChart2, Bell, UserCircle, LogOut, ChevronLeft, ChevronRight,
  Cpu, Shield, FolderOpen
} from 'lucide-react';
import { logout } from '../../redux/auth/authSlice';

const getNavItems = (role, basePath) => {
  const items = [
    { label: 'Dashboard', icon: LayoutDashboard, path: basePath },
  ];

  if (['SuperAdmin', 'TenantAdmin', 'Manager'].includes(role)) {
    items.push({ label: 'Employees', icon: Users, path: `${basePath}/employees` });
    items.push({ label: 'Attendance', icon: Clock, path: `${basePath}/attendance` });
    items.push({ label: 'Leave Approvals', icon: CalendarDays, path: `${basePath}/leaves` });
    items.push({ label: 'Approvals', icon: CheckSquare, path: `${basePath}/approvals` });
  }

  if (role === 'Employee') {
    items.push({ label: 'Punch In/Out', icon: Clock, path: `${basePath}/attendance` });
    items.push({ label: 'Apply Leave', icon: CalendarDays, path: `${basePath}/leaves` });
    items.push({ label: 'Leave Balance', icon: BarChart2, path: `${basePath}/leave-balance` });
    items.push({ label: 'Leave History', icon: BarChart2, path: `${basePath}/leave-history` });
  }

  items.push({ label: 'Notifications', icon: Bell, path: `${basePath}/notifications` });
  items.push({ label: 'Documents', icon: FolderOpen, path: `${basePath}/documents` });
  items.push({ label: 'My Profile', icon: UserCircle, path: `${basePath}/profile` });

  return items;
};

const Sidebar = ({ basePath, mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = getNavItems(user?.role, basePath);

  const handleLogout = () => {
    dispatch(logout());
    if (setMobileOpen) setMobileOpen(false);
    navigate('/');
  };

  const handleLinkClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside 
      className={`sidebar-container ${mobileOpen ? 'mobile-open' : ''}`}
      style={{ width: collapsed ? '72px' : '240px' }}
    >
      {/* Logo */}
      <div style={styles.logoRow}>
        {!collapsed && (
          <div style={styles.logo}>
            <Cpu size={22} color="#6366f1" />
            <span style={styles.logoText}>HRMS<span style={{ color: '#6366f1' }}>Platform</span></span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={styles.collapseBtn}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User Badge */}
      {!collapsed && user && (
        <div style={styles.userBadge} className="glass-card">
          <div style={styles.avatarCircle}>
            {user.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userEmail}>{user.email}</div>
            <div style={styles.userRole}>{user.role === 'TenantAdmin' ? 'HR - Manager' : user.role}</div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <Icon size={20} color={isActive ? '#6366f1' : '#6b7280'} />
              {!collapsed && <span style={{ color: isActive ? '#f3f4f6' : '#9ca3af' }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} style={{ ...styles.logoutBtn, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <LogOut size={20} color="#ef4444" />
        {!collapsed && <span>Log Out</span>}
      </button>
    </aside>
  );
};

const styles = {
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0d1117',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    padding: '20px 12px',
    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
    overflow: 'hidden',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    paddingLeft: '4px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#f3f4f6',
    letterSpacing: '-0.5px',
  },
  collapseBtn: {
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px',
    borderRadius: '6px',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '10px',
  },
  avatarCircle: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0,
  },
  userInfo: {
    overflow: 'hidden',
  },
  userEmail: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#f3f4f6',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '11px',
    color: '#6366f1',
    fontWeight: '500',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    overflow: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
  },
  navItemActive: {
    background: 'rgba(99,102,241,0.12)',
    borderLeft: '3px solid #6366f1',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#ef4444',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '8px',
    transition: 'background 0.2s',
    background: 'rgba(239,68,68,0.05)',
    border: '1px solid rgba(239,68,68,0.1)',
  },
};

export default Sidebar;
