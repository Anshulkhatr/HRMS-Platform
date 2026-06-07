import React, { useEffect, useState } from 'react';
import { clockIn, clockOut, getMyAttendance } from '../../api/attendanceApi';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const PunchInOut = () => {
  const [attendance, setAttendance] = useState([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = () => {
    getMyAttendance().then(res => {
      const data = res.data || [];
      setAttendance(data);
      setToday(data.find(a => a.date === new Date().toISOString().split('T')[0]) || null);
    }).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const showMsg = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await clockIn();
      showMsg('Successfully clocked in!', 'success');
      load();
    } catch (e) {
      showMsg(e.response?.data?.message || 'Failed to clock in', 'error');
    }
    setLoading(false);
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await clockOut();
      showMsg('Successfully clocked out!', 'success');
      load();
    } catch (e) {
      showMsg(e.response?.data?.message || 'Failed to clock out', 'error');
    }
    setLoading(false);
  };

  const isClockedIn = !!today?.clockIn;
  const isClockedOut = !!today?.clockOut;

  return (
    <div style={styles.container}>
      <div>
        <h1 style={styles.title}>Attendance</h1>
        <p style={styles.sub}>Track your daily working hours</p>
      </div>

      {/* Clock Widget */}
      <div className="glass-card" style={styles.clockCard}>
        <div style={styles.liveTime}>{time.toLocaleTimeString()}</div>
        <div style={styles.liveDate}>{time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>

        <div style={styles.statusRow}>
          {isClockedIn && !isClockedOut && (
            <span style={styles.activePill}>
              <span style={styles.activeDot} className="animate-float" />
              Currently Working
            </span>
          )}
          {isClockedOut && <span style={styles.donePill}>✅ Work Complete</span>}
          {!isClockedIn && <span style={styles.idlePill}>⏸ Not Clocked In</span>}
        </div>

        {today && (
          <div style={styles.todayInfo}>
            {today.clockIn && (
              <div style={styles.infoRow}>
                <CheckCircle size={16} color="#10b981" />
                <span>In: <strong>{new Date(today.clockIn).toLocaleTimeString()}</strong></span>
                <span style={today.status === 'Late' ? styles.lateTag : styles.onTimeTag}>{today.status}</span>
              </div>
            )}
            {today.clockOut && (
              <div style={styles.infoRow}>
                <XCircle size={16} color="#ef4444" />
                <span>Out: <strong>{new Date(today.clockOut).toLocaleTimeString()}</strong></span>
              </div>
            )}
          </div>
        )}

        {msg.text && (
          <div style={{ ...styles.msgAlert, ...(msg.type === 'success' ? styles.successMsg : styles.errorMsg) }}>
            {msg.text}
          </div>
        )}

        <div style={{ ...styles.btnGroup, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={handleClockIn}
            disabled={loading || isClockedIn}
            style={{ ...styles.punchBtn, opacity: isClockedIn ? 0.4 : 1 }}
          >
            <Clock size={20} />
            {loading ? 'Processing...' : 'Clock In'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleClockOut}
            disabled={loading || !isClockedIn || isClockedOut}
            style={{ ...styles.punchBtn, opacity: (!isClockedIn || isClockedOut) ? 0.4 : 1 }}
          >
            <Clock size={20} />
            Clock Out
          </button>
        </div>
      </div>

      {/* History */}
      <div className="glass-card" style={styles.histCard}>
        <h3 style={styles.histTitle}>Attendance History</h3>
        {attendance.length === 0 ? (
          <div style={styles.empty}>No records found.</div>
        ) : (
          <div className="responsive-table-container">
            <table style={styles.table}>
              <thead>
                <tr>{['Date', 'Clock In', 'Clock Out', 'Status'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[...attendance].reverse().slice(0, 10).map((a, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}>{a.date}</td>
                    <td style={styles.td}>{a.clockIn ? new Date(a.clockIn).toLocaleTimeString() : '—'}</td>
                    <td style={styles.td}>{a.clockOut ? new Date(a.clockOut).toLocaleTimeString() : '—'}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...statusColor(a.status) }}>{a.status}</span>
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

const statusColor = s => ({
  Present: { backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' },
  Late: { backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  Absent: { backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  OnLeave: { backgroundColor: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
}[s] || {});

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#f3f4f6' },
  sub: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  clockCard: { padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' },
  liveTime: { fontSize: '56px', fontWeight: '800', letterSpacing: '-2px', background: 'linear-gradient(135deg,#a5b4fc,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  liveDate: { fontSize: '14px', color: '#6b7280' },
  statusRow: { display: 'flex', justifyContent: 'center' },
  activePill: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '600' },
  activeDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' },
  donePill: { backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '600' },
  idlePill: { backgroundColor: 'rgba(107,114,128,0.1)', border: '1px solid rgba(107,114,128,0.2)', color: '#9ca3af', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '600' },
  todayInfo: { display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '340px' },
  infoRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#d1d5db', justifyContent: 'center' },
  lateTag: { backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: '600' },
  onTimeTag: { backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: '600' },
  msgAlert: { padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  successMsg: { backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' },
  errorMsg: { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' },
  btnGroup: { display: 'flex', gap: '16px', marginTop: '8px' },
  punchBtn: { padding: '14px 32px', fontSize: '15px', gap: '10px' },
  histCard: { padding: '24px' },
  histTitle: { fontSize: '15px', fontWeight: '700', color: '#f3f4f6', marginBottom: '20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 14px', fontSize: '11px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { padding: '12px 14px', fontSize: '13px', color: '#d1d5db' },
  badge: { padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600' },
  empty: { textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '14px' },
};

export default PunchInOut;
