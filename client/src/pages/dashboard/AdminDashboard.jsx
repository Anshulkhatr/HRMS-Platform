import React, { useEffect, useState } from 'react';
import { Users, Clock, CalendarDays, CheckSquare, TrendingUp, Activity } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, todayPresent: 0, pendingLeaves: 0, attendanceRate: 0, attendanceBreakdown: [], recentActivity: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>
          <p style={styles.pageSubtitle}>Welcome back — here's what's happening today.</p>
        </div>
        <div style={styles.dateBadge}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard icon={Users} label="Total Employees" value={loading ? '...' : stats.totalEmployees} color="#6366f1" trend={4} />
        <StatCard icon={Clock} label="Present Today" value={loading ? '...' : stats.todayPresent} color="#06b6d4" trend={-2} />
        <StatCard icon={CalendarDays} label="Pending Leaves" value={loading ? '...' : stats.pendingLeaves} color="#f59e0b" />
        <StatCard icon={TrendingUp} label="Attendance Rate" value={loading ? '...' : `${stats.attendanceRate}%`} color="#10b981" trend={1} />
      </div>

      {/* Two Column Content */}
      <div style={styles.twoCol}>
        {/* Recent Activity */}
        <div className="glass-card" style={styles.activityCard}>
          <div style={styles.cardHeader}>
            <Activity size={18} color="#6366f1" />
            <h3 style={styles.cardTitle}>Recent Activity</h3>
          </div>
          <div style={styles.activityList}>
            {(!stats.recentActivity || stats.recentActivity.length === 0) ? (
              <div style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No recent activity.</div>
            ) : (
              stats.recentActivity.map((item, i) => (
                <div key={i} style={styles.activityItem}>
                  <div style={{ ...styles.activityDot, backgroundColor: item.color }} />
                  <div>
                    <div style={styles.activityText}>{item.text}</div>
                    <div style={styles.activityTime}>{item.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Attendance Breakdown */}
        <div className="glass-card" style={styles.attendanceCard}>
          <div style={styles.cardHeader}>
            <CheckSquare size={18} color="#06b6d4" />
            <h3 style={styles.cardTitle}>Today's Attendance</h3>
          </div>
          <div style={styles.attendanceBars}>
            {(!stats.attendanceBreakdown || stats.attendanceBreakdown.length === 0) ? (
              <div style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No attendance data today.</div>
            ) : (
              stats.attendanceBreakdown.map((bar, i) => (
                <div key={i} style={styles.barRow}>
                  <span style={styles.barLabel}>{bar.label}</span>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width: `${bar.pct}%`, backgroundColor: bar.color }} />
                  </div>
                  <span style={styles.barPct}>{bar.pct}%</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '28px' },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
  },
  pageTitle: { fontSize: '24px', fontWeight: '800', color: '#f3f4f6', marginBottom: '4px' },
  pageSubtitle: { fontSize: '14px', color: '#6b7280' },
  dateBadge: {
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '13px',
    color: '#a5b4fc',
    fontWeight: '500',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flexWrap: 'wrap' },
  activityCard: { padding: '24px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#f3f4f6' },
  activityList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  activityItem: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  activityDot: { width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0 },
  activityText: { fontSize: '13px', color: '#d1d5db', fontWeight: '500' },
  activityTime: { fontSize: '12px', color: '#6b7280', marginTop: '2px' },
  attendanceCard: { padding: '24px' },
  attendanceBars: { display: 'flex', flexDirection: 'column', gap: '16px' },
  barRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  barLabel: { fontSize: '13px', color: '#9ca3af', width: '70px', flexShrink: 0 },
  barTrack: { flex: 1, height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '999px', transition: 'width 1s ease-out' },
  barPct: { fontSize: '12px', color: '#9ca3af', width: '36px', textAlign: 'right' },
};

export default AdminDashboard;
