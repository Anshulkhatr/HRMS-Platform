import React, { useEffect, useState } from 'react';
import { getAllAttendance } from '../../api/attendanceApi';
import { Clock, Filter } from 'lucide-react';

const AttendanceTable = () => {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllAttendance(date).then(res => setRecords(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [date]);

  const statusColors = {
    Present: { backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' },
    Absent: { backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' },
    Late: { backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    OnLeave: { backgroundColor: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
    HalfDay: { backgroundColor: 'rgba(6,182,212,0.15)', color: '#22d3ee' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Attendance Records</h1>
          <p style={styles.sub}>{records.length} records for {date}</p>
        </div>
        <div style={styles.filterRow}>
          <Filter size={16} color="#6b7280" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="form-input"
            style={styles.dateInput}
          />
        </div>
      </div>

      <div className="glass-card" style={styles.card}>
        {loading ? (
          <div style={styles.loading}>Loading attendance...</div>
        ) : records.length === 0 ? (
          <div style={styles.empty}>
            <Clock size={40} color="#374151" />
            <p>No attendance records for this date.</p>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Employee', 'Date', 'Clock In', 'Clock Out', 'Duration', 'Status'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => {
                  const duration = r.clockIn && r.clockOut
                    ? `${Math.floor((new Date(r.clockOut) - new Date(r.clockIn)) / 3600000)}h ${Math.floor(((new Date(r.clockOut) - new Date(r.clockIn)) % 3600000) / 60000)}m`
                    : '—';
                  return (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.empName}>
                          <div style={styles.avatar}>
                            {r.employeeId?.firstName?.[0]}{r.employeeId?.lastName?.[0]}
                          </div>
                          <span>{r.employeeId?.firstName} {r.employeeId?.lastName}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{r.date}</td>
                      <td style={styles.td}>{r.clockIn ? new Date(r.clockIn).toLocaleTimeString() : '—'}</td>
                      <td style={styles.td}>{r.clockOut ? new Date(r.clockOut).toLocaleTimeString() : '—'}</td>
                      <td style={styles.td}>{duration}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...(statusColors[r.status] || {}) }}>{r.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#f3f4f6' },
  sub: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  filterRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  dateInput: { fontSize: '14px', padding: '8px 12px' },
  card: { padding: '24px' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 14px', fontSize: '11px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { padding: '14px', fontSize: '13px', color: '#d1d5db', verticalAlign: 'middle' },
  empName: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 },
  badge: { padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600' },
  loading: { textAlign: 'center', padding: '40px', color: '#6b7280' },
  empty: { textAlign: 'center', padding: '60px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' },
};

export default AttendanceTable;
