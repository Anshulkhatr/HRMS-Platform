import React, { useEffect, useState } from 'react';
import { Users, Clock, CalendarDays, CheckSquare } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { getAllLeaves } from '../../api/leaveApi';
import api from '../../api/axios';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, todayPresent: 0, pendingLeaves: 0, attendanceRate: 0 });
  const [pendingLeavesList, setPendingLeavesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats
    api.get('/dashboard/stats')
      .then(res => setStats(res.data.data))
      .catch(() => {});

    // Fetch pending leaves
    getAllLeaves('Pending')
      .then(res => setPendingLeavesList(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Manager Dashboard</h1>
          <p style={styles.pageSubtitle}>Your team overview for today.</p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard icon={Users} label="Team Members" value={loading ? '...' : stats.totalEmployees} color="#6366f1" />
        <StatCard icon={Clock} label="Present Today" value={loading ? '...' : stats.todayPresent} color="#10b981" />
        <StatCard icon={CalendarDays} label="Pending Leaves" value={loading ? '...' : stats.pendingLeaves} color="#f59e0b" />
        <StatCard icon={CheckSquare} label="Attendance Rate" value={loading ? '...' : `${stats.attendanceRate}%`} color="#06b6d4" />
      </div>

      {/* Pending Leave Requests */}
      <div className="glass-card" style={styles.tableCard}>
        <div style={styles.cardHeader}>
          <CalendarDays size={18} color="#f59e0b" />
          <h3 style={styles.cardTitle}>Pending Leave Requests</h3>
        </div>
        {pendingLeavesList.length === 0 ? (
          <div style={styles.empty}>No pending leave requests.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {['Employee', 'Type', 'Start', 'End', 'Status'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingLeavesList.map((l, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={styles.td}>{l.employeeId?.userId?.email || 'N/A'}</td>
                  <td style={styles.td}>{l.type}</td>
                  <td style={styles.td}>{new Date(l.startDate).toLocaleDateString()}</td>
                  <td style={styles.td}>{new Date(l.endDate).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '28px' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  pageTitle: { fontSize: '24px', fontWeight: '800', color: '#f3f4f6', marginBottom: '4px' },
  pageSubtitle: { fontSize: '14px', color: '#6b7280' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  tableCard: { padding: '24px', overflowX: 'auto' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#f3f4f6' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' },
  td: { padding: '12px', fontSize: '13px', color: '#d1d5db' },
  badge: { backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' },
  empty: { color: '#6b7280', textAlign: 'center', padding: '40px 0', fontSize: '14px' },
};

export default ManagerDashboard;
