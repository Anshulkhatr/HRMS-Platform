import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Topbar from '../components/ui/Topbar';

const EmployeeLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={styles.wrapper}>
      {mobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileOpen(false)} 
        />
      )}
      <Sidebar basePath="/employee" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div style={styles.main}>
        <Topbar basePath="/employee" toggleSidebar={() => setMobileOpen(!mobileOpen)} />
        <div style={styles.content} className="layout-content-padding">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#070a13',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: '28px',
    overflowY: 'auto',
  },
};

export default EmployeeLayout;
