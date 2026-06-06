import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Topbar from '../components/ui/Topbar';

const ManagerLayout = () => {
  return (
    <div style={styles.wrapper}>
      <Sidebar basePath="/manager" />
      <div style={styles.main}>
        <Topbar basePath="/manager" />
        <div style={styles.content}>
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

export default ManagerLayout;
