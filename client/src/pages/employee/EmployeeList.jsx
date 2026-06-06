import React, { useEffect, useState } from 'react';
import { Search, Plus, Trash2, Eye, UserCheck } from 'lucide-react';
import { getEmployees, deleteEmployee } from '../../api/employeeApi';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(s => s.auth);
  const basePath = user?.role === 'Manager' ? '/manager' : '/admin';

  const load = () => {
    setLoading(true);
    getEmployees().then(res => setEmployees(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('search') || '';
    setSearch(q);
  }, [location.search]);

  const filtered = employees.filter(e =>
    `${e.firstName} ${e.lastName} ${e.department} ${e.position}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    await deleteEmployee(id);
    load();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Employees</h1>
          <p style={styles.sub}>{employees.length} total records</p>
        </div>
        {['SuperAdmin','TenantAdmin','Manager'].includes(user?.role) && (
          <Link to={`${basePath}/employees/add`} className="btn btn-primary" style={styles.addBtn}>
            <Plus size={18} /> Add Employee
          </Link>
        )}
      </div>

      <div className="glass-card" style={styles.card}>
        <div style={styles.searchRow}>
          <div style={styles.searchWrap}>
            <Search size={16} color="#6b7280" style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, department, position..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={styles.searchInput}
            />
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading employees...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <UserCheck size={40} color="#374151" />
            <p>No employees found.</p>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Name', 'Department', 'Position', 'Joining Date', 'Status', 'Actions'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, i) => (
                  <tr key={emp._id || i} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.empName}>
                        <div style={styles.avatar}>{emp.firstName?.[0]}{emp.lastName?.[0]}</div>
                        <div>
                          <div style={styles.empFullName}>{emp.firstName} {emp.lastName}</div>
                          <div style={styles.empEmail}>{emp.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>{emp.department}</td>
                    <td style={styles.td}>{emp.position}</td>
                    <td style={styles.td}>{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : '-'}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...statusColor(emp.status) }}>{emp.status}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <Link to={`${basePath}/employees/${emp._id}`} style={styles.iconBtn} title="View">
                          <Eye size={16} color="#6366f1" />
                        </Link>
                        {['SuperAdmin','TenantAdmin'].includes(user?.role) && (
                          <button style={styles.iconBtn} onClick={() => handleDelete(emp._id)} title="Delete">
                            <Trash2 size={16} color="#ef4444" />
                          </button>
                        )}
                      </div>
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

const statusColor = (s) => {
  if (s === 'active') return { backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' };
  if (s === 'terminated') return { backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' };
  return { backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' };
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: '24px', fontWeight: '800', color: '#f3f4f6' },
  sub: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  addBtn: { padding: '10px 20px' },
  card: { padding: '24px' },
  searchRow: { marginBottom: '20px' },
  searchWrap: { position: 'relative', maxWidth: '400px' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' },
  searchInput: { paddingLeft: '38px', width: '100%' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 14px', fontSize: '11px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' },
  td: { padding: '14px', fontSize: '13px', color: '#d1d5db', verticalAlign: 'middle' },
  empName: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  empFullName: { fontWeight: '600', color: '#f3f4f6', fontSize: '13px' },
  empEmail: { fontSize: '12px', color: '#6b7280' },
  badge: { padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600' },
  actions: { display: 'flex', gap: '8px', alignItems: 'center' },
  iconBtn: { cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center', padding: '4px' },
  loading: { textAlign: 'center', padding: '40px', color: '#6b7280' },
  empty: { textAlign: 'center', padding: '60px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' },
};

export default EmployeeList;
