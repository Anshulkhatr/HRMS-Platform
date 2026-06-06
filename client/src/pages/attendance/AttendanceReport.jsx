import React from 'react';
import { Download, FileText } from 'lucide-react';
import api from '../../api/axios';

const AttendanceReport = () => {
  const downloadReport = async (type) => {
    try {
      const response = await api.get(`/reports/${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to download report.');
    }
  };

  const reports = [
    { id: 'attendance', label: 'Attendance Report', desc: 'Download full attendance log with clock-in/out times, durations, and statuses for all employees.', color: '#6366f1' },
    { id: 'leaves', label: 'Leave Report', desc: 'Download all leave requests including type, status, approval details, and employee information.', color: '#10b981' },
  ];

  return (
    <div style={styles.container}>
      <div>
        <h1 style={styles.title}>Reports & Exports</h1>
        <p style={styles.sub}>Download CSV reports for payroll and HR analysis.</p>
      </div>

      <div style={styles.grid}>
        {reports.map(r => (
          <div key={r.id} className="glass-card" style={styles.card}>
            <div style={{ ...styles.iconWrap, backgroundColor: `${r.color}15`, border: `1px solid ${r.color}25` }}>
              <FileText size={28} color={r.color} />
            </div>
            <h3 style={styles.cardTitle}>{r.label}</h3>
            <p style={styles.cardDesc}>{r.desc}</p>
            <button
              className="btn btn-primary"
              onClick={() => downloadReport(r.id)}
              style={{ ...styles.dlBtn, background: `linear-gradient(135deg, ${r.color}, ${r.color}cc)` }}
            >
              <Download size={16} />
              Download CSV
            </button>
          </div>
        ))}
      </div>

      <div className="glass-card" style={styles.note}>
        <p style={styles.noteText}>
          💡 Reports are generated in real-time from the database and include all records scoped to your tenant workspace.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#f3f4f6' },
  sub: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '20px' },
  card: { padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px' },
  iconWrap: { width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#f3f4f6' },
  cardDesc: { fontSize: '13px', color: '#9ca3af', lineHeight: 1.6, flex: 1 },
  dlBtn: { marginTop: '8px', padding: '12px 20px', width: 'fit-content' },
  note: { padding: '20px' },
  noteText: { fontSize: '13px', color: '#9ca3af' },
};

export default AttendanceReport;
