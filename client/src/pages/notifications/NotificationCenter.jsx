import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCircle2, Clock, AlertCircle, Info } from 'lucide-react';
import {
  getNotifications,
  markAllRead,
  deleteNotification,
  clearAllNotifications,
} from '../../api/notificationApi';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications(notifications.filter(n => n._id !== id));
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    await clearAllNotifications();
    setNotifications([]);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} style={{ color: 'var(--success, #10b981)' }} />;
      case 'warning': return <Clock size={20} style={{ color: 'var(--warning, #f59e0b)' }} />;
      case 'error':   return <AlertCircle size={20} style={{ color: '#ef4444' }} />;
      default:        return <Info size={20} style={{ color: 'var(--primary, #6366f1)' }} />;
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }} className="animate-slide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }} className="text-gradient">
            Notification Center
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {loading ? 'Loading...' : `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}${unreadCount > 0 ? ` · ${unreadCount} unread` : ''}`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
            >
              <Check size={16} />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#ef4444' }}
            >
              <Trash2 size={16} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Bell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Bell size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>You're all caught up!</p>
          <p style={{ fontSize: '13px', opacity: 0.7 }}>No new notifications.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                position: 'relative',
                opacity: notif.read ? 0.7 : 1,
                borderLeft: notif.read ? '1px solid var(--glass-border)' : '4px solid var(--primary)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {getIcon(notif.type)}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {notif.title}
                  {!notif.read && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'inline-block' }} />
                  )}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>{notif.message}</p>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{timeAgo(notif.createdAt)}</span>
              </div>

              <button
                onClick={() => handleDelete(notif._id)}
                style={{
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'var(--transition-smooth)',
                  background: 'none',
                  border: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
