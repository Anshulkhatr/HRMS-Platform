import React, { useEffect, useState } from 'react';
import { Clock, CalendarDays, CheckSquare, TrendingUp } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { getMyAttendance, clockIn, clockOut } from '../../api/attendanceApi';
import { getMyLeaves } from '../../api/leaveApi';
import { useSelector } from 'react-redux';

const EmployeeDashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [clockMsg, setClockMsg] = useState('');
  const [clockLoading, setClockLoading] = useState(false);

  useEffect(() => {
    getMyAttendance().then(res => setAttendance(res.data || [])).catch(() => {});
    getMyLeaves().then(res => setLeaves(res.data || [])).catch(() => {});
  }, []);

  const today = attendance.find(a => a.date === new Date().toISOString().split('T')[0]);
  const presentDays = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;

  const handleClockIn = async () => {
    setClockLoading(true);
    try {
      await clockIn();
      setClockMsg('✅ Clocked in successfully!');
      getMyAttendance().then(res => setAttendance(res.data || []));
    } catch (e) {
      setClockMsg(e.response?.data?.message || 'Clock in failed');
    }
    setClockLoading(false);
    setTimeout(() => setClockMsg(''), 4000);
  };

  const handleClockOut = async () => {
    setClockLoading(true);
    try {
      await clockOut();
      setClockMsg('✅ Clocked out successfully!');
      getMyAttendance().then(res => setAttendance(res.data || []));
    } catch (e) {
      setClockMsg(e.response?.data?.message || 'Clock out failed');
    }
    setClockLoading(false);
    setTimeout(() => setClockMsg(''), 4000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>My Dashboard</h1>
          <p style={styles.pageSubtitle}>Hello, {user?.email?.split('@')[0]} 👋 Here's your summary.</p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard icon={Clock} label="Days Present" value={presentDays} color="#10b981" />
        <StatCard icon={CalendarDays} label="Pending Leaves" value={pendingLeaves} color="#f59e0b" />
        <StatCard icon={CheckSquare} label="Approved Leaves" value={approvedLeaves} color="#6366f1" />
        <StatCard icon={TrendingUp} label="Attendance Rate" value={attendance.length ? `${Math.round((presentDays / attendance.length) * 100)}%` : 'N/A'} color="#06b6d4" />
      </div>

      {/* Punch Clock Widget */}
      <div className="glass-card" style={styles.punchCard}>
        <div style={styles.punchTitle}>Today's Attendance</div>
        <div style={styles.punchDate}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
        {today?.clockIn && (
          <div style={styles.punchInfo}>
            <span style={styles.punchLabel}>Clocked In:</span>
            <span style={styles.punchValue}>{new Date(today.clockIn).toLocaleTimeString()}</span>
          </div>
        )}
        {today?.clockOut && (
          <div style={styles.punchInfo}>
            <span style={styles.punchLabel}>Clocked Out:</span>
            <span style={styles.punchValue}>{new Date(today.clockOut).toLocaleTimeString()}</span>
          </div>
        )}
        {clockMsg && <div style={styles.clockMsg}>{clockMsg}</div>}
        <div style={{ ...styles.punchButtons, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={handleClockIn}
            disabled={clockLoading || !!today?.clockIn}
            style={{ opacity: today?.clockIn ? 0.5 : 1 }}
          >
            {clockLoading ? 'Processing...' : '🟢 Clock In'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleClockOut}
            disabled={clockLoading || !today?.clockIn || !!today?.clockOut}
            style={{ opacity: (!today?.clockIn || today?.clockOut) ? 0.5 : 1 }}
          >
            🔴 Clock Out
          </button>
        </div>
      </div>

      {/* Recent Leaves */}
      <div className="glass-card" style={styles.leaveCard}>
        <div style={styles.cardHeader}>
          <CalendarDays size={18} color="#f59e0b" />
          <h3 style={styles.cardTitle}>My Recent Leaves</h3>
        </div>
        {leaves.length === 0 ? (
          <div style={styles.empty}>No leave requests found.</div>
        ) : (
          <div className="responsive-table-container">
            <table style={styles.table}>
              <thead>
                <tr>{['Type', 'Start', 'End', 'Status'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {leaves.slice(0, 5).map((l, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}>{l.type}</td>
                    <td style={styles.td}>{new Date(l.startDate).toLocaleDateString()}</td>
                    <td style={styles.td}>{new Date(l.endDate).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...statusColor(l.status) }}>{l.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const statusColor = (status) => {
  if (status === 'Approved') return { backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' };
  if (status === 'Rejected') return { backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' };
  return { backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' };
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '28px' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  pageTitle: { fontSize: '24px', fontWeight: '800', color: '#f3f4f6', marginBottom: '4px' },
  pageSubtitle: { fontSize: '14px', color: '#6b7280' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  punchCard: { padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' },
  punchTitle: { fontSize: '18px', fontWeight: '700', color: '#f3f4f6' },
  punchDate: { fontSize: '14px', color: '#9ca3af' },
  punchInfo: { display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' },
  punchLabel: { fontSize: '13px', color: '#6b7280' },
  punchValue: { fontSize: '13px', fontWeight: '600', color: '#f3f4f6' },
  clockMsg: { fontSize: '13px', color: '#10b981', fontWeight: '600' },
  punchButtons: { display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' },
  leaveCard: { padding: '24px', overflowX: 'auto' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#f3f4f6' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { padding: '12px', fontSize: '13px', color: '#d1d5db' },
  badge: { padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' },
  empty: { color: '#6b7280', textAlign: 'center', padding: '40px 0', fontSize: '14px' },
};

export default EmployeeDashboard;
