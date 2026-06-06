import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById, updateEmployee } from '../../api/employeeApi';
import { User, Briefcase, DollarSign, Calendar, ArrowLeft, Phone } from 'lucide-react';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getEmployeeById(id).then(res => {
      setEmp(res.data);
      setForm(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateEmployee(id, {
        department: form.department,
        position: form.position,
        salary: form.salary,
        status: form.status,
        phoneNumber: form.phoneNumber
      });
      setEmp(form);
      setEditing(false);
    } catch (e) {}
    setSaving(false);
  };

  if (loading) return <div style={styles.loading}>Loading profile...</div>;
  if (!emp) return <div style={styles.loading}>Employee not found.</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={styles.profileHeader} className="glass-card">
        <div style={styles.avatarLg}>
          {emp.firstName?.[0]}{emp.lastName?.[0]}
        </div>
        <div>
          <h2 style={styles.empName}>{emp.firstName} {emp.lastName}</h2>
          <p style={styles.empPos}>{emp.position} · {emp.department}</p>
          <span style={{ ...styles.badge, ...statusColor(emp.status) }}>{emp.status}</span>
        </div>
        <button className="btn btn-secondary" style={styles.editBtn} onClick={() => setEditing(!editing)}>
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div style={styles.infoGrid}>
        <InfoCard icon={User} label="User Email" value={emp.userId?.email || 'N/A'} />
        <InfoCard icon={Phone} label="Phone Number" value={editing
          ? <input className="form-input" value={form.phoneNumber || ''} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} style={styles.editInput} />
          : (emp.phoneNumber || 'N/A')} />
        <InfoCard icon={Briefcase} label="Department" value={editing
          ? <input className="form-input" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={styles.editInput} />
          : emp.department} />
        <InfoCard icon={Briefcase} label="Position" value={editing
          ? <input className="form-input" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={styles.editInput} />
          : emp.position} />
        <InfoCard icon={Calendar} label="Joining Date" value={emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : 'N/A'} />
        <InfoCard icon={DollarSign} label="Salary" value={editing
          ? <input className="form-input" type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} style={styles.editInput} />
          : (emp.salary ? `$${Number(emp.salary).toLocaleString()}` : 'N/A')} />
        <InfoCard icon={User} label="Status" value={editing
          ? (
            <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={styles.editInput}>
              <option value="active">Active</option>
              <option value="terminated">Terminated</option>
              <option value="on-leave">On Leave</option>
            </select>
          ) : emp.status} />
      </div>

      {editing && (
        <div style={styles.saveRow}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="glass-card" style={styles.infoCard}>
    <div style={styles.infoIconRow}>
      <Icon size={16} color="#6366f1" />
      <span style={styles.infoLabel}>{label}</span>
    </div>
    <div style={styles.infoValue}>{value}</div>
  </div>
);

const statusColor = s => ({
  active: { backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' },
  terminated: { backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  'on-leave': { backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
}[s] || {});

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#9ca3af', fontSize: '14px', background: 'none', border: 'none' },
  profileHeader: { padding: '28px', display: 'flex', alignItems: 'center', gap: '24px' },
  avatarLg: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', flexShrink: 0 },
  empName: { fontSize: '22px', fontWeight: '800', color: '#f3f4f6', marginBottom: '4px' },
  empPos: { fontSize: '14px', color: '#9ca3af', marginBottom: '8px' },
  badge: { padding: '3px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' },
  editBtn: { marginLeft: 'auto' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  infoCard: { padding: '20px' },
  infoIconRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  infoLabel: { fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: { fontSize: '15px', color: '#f3f4f6', fontWeight: '600' },
  editInput: { fontSize: '14px', padding: '8px 12px' },
  saveRow: { display: 'flex', justifyContent: 'flex-end' },
  loading: { color: '#6b7280', textAlign: 'center', padding: '60px' },
};

export default EmployeeProfile;
