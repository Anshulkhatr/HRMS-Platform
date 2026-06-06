import React, { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getNotifications } from '../../api/notificationApi';

const Topbar = ({ basePath }) => {
  const { user } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        const unread = data.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        // silently fail
      }
    };

    fetchNotifications();
    // Poll every 30 seconds to keep it fresh
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`${basePath}/employees?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={styles.topbar}>
      {['SuperAdmin', 'TenantAdmin'].includes(user?.role) ? (
        <div style={styles.searchWrapper}>
          <Search size={16} color="#6b7280" style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search employees, records..."
            style={styles.searchInput}
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      ) : (
        <div />
      )}

      <div style={styles.actions}>
        <Link to={`${basePath}/notifications`} style={styles.bellBtn}>
          <Bell size={20} color="#9ca3af" />
          {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
        </Link>

        <div style={styles.avatarCircle}>
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

const styles = {
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 28px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    backgroundColor: '#0d1117',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '360px',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: '38px',
    height: '38px',
    fontSize: '14px',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '8px',
    color: '#f3f4f6',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  bellBtn: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-6px',
    backgroundColor: '#6366f1',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    cursor: 'pointer',
  },
};

export default Topbar;
