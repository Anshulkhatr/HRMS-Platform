import React from 'react';

const StatCard = ({ icon: Icon, label, value, color = '#6366f1', trend }) => {
  return (
    <div className="glass-card" style={styles.card}>
      <div style={styles.top}>
        <div style={{ ...styles.iconBox, backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon size={22} color={color} />
        </div>
        {trend !== undefined && (
          <span style={{ ...styles.trend, color: trend >= 0 ? '#10b981' : '#ef4444' }}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={styles.value}>{value}</div>
      <div style={styles.label}>{label}</div>
    </div>
  );
};

const styles = {
  card: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trend: {
    fontSize: '12px',
    fontWeight: '700',
  },
  value: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#f3f4f6',
    letterSpacing: '-0.5px',
  },
  label: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  },
};

export default StatCard;
