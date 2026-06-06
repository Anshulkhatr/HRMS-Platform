import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createEmployee, getEmployees } from '../../api/employeeApi';
import { getUsers } from '../../api/authApi';
import { UserPlus, UserCheck, Key } from 'lucide-react';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const loggedInRole = currentUser?.role || 'Employee';
  const [form, setForm] = useState({ 
    userId: '', 
    email: '', 
    password: '', 
    role: 'Employee',
    firstName: '', 
    lastName: '', 
    phoneNumber: '',
    department: 'Engineering', 
    position: 'Software Engineer', 
    joiningDate: '', 
    salary: '' 
  });
  
  const [createAccountMode, setCreateAccountMode] = useState(true); // default to creating a new account
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        const employeesRes = await getEmployees();
        const employeesList = employeesRes.data || [];
        
        // Filter users who do not have an employee profile yet
        const unassociated = (usersData || []).filter(
          u => !employeesList.some(emp => emp.userId && String(emp.userId._id || emp.userId) === String(u._id))
        );
        
        setUsers(unassociated);
      } catch (err) {
        setError('Failed to load user list.');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      department: form.department,
      position: form.position,
      joiningDate: form.joiningDate,
      salary: form.salary ? Number(form.salary) : undefined
    };

    if (createAccountMode) {
      if (!form.email || !form.password) {
        setError('Email and password are required for new accounts.');
        setLoading(false);
        return;
      }
      payload.email = form.email;
      payload.password = form.password;
      payload.role = form.role;
    } else {
      if (!form.userId) {
        setError('Please select a user account to link.');
        setLoading(false);
        return;
      }
      payload.userId = form.userId;
    }

    try {
      await createEmployee(payload);
      navigate('/admin/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="animate-slide">
      <div style={styles.header}>
        <h1 style={styles.title}>Add New Employee</h1>
        <p style={styles.sub}>Create a new employee profile and link or create their user credentials.</p>
      </div>

      <div className="glass-card" style={styles.formCard}>
        {/* Creation Mode Selector */}
        <div style={styles.modeTabs}>
          <button
            type="button"
            onClick={() => setCreateAccountMode(true)}
            style={{
              ...styles.tabBtn,
              ...(createAccountMode ? styles.activeTab : {})
            }}
          >
            <UserPlus size={16} />
            Create New Credentials
          </button>
          <button
            type="button"
            onClick={() => setCreateAccountMode(false)}
            style={{
              ...styles.tabBtn,
              ...(!createAccountMode ? styles.activeTab : {})
            }}
          >
            <UserCheck size={16} />
            Link Existing User
          </button>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            {/* User Credentials Segment */}
            {createAccountMode ? (
              <>
                <div style={styles.inputGroup}>
                  <label className="form-label" style={styles.label}>Account Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="employee@domain.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label className="form-label" style={styles.label}>Account Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label className="form-label" style={styles.label}>Account Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={{ ...styles.input, background: 'var(--bg-secondary)', cursor: 'pointer' }}
                  >
                    <option value="Employee" style={{ background: 'var(--bg-secondary)' }}>Employee</option>
                    {(loggedInRole === 'TenantAdmin' || loggedInRole === 'SuperAdmin') && (
                      <option value="Manager" style={{ background: 'var(--bg-secondary)' }}>Manager</option>
                    )}
                    {loggedInRole === 'SuperAdmin' && (
                      <option value="TenantAdmin" style={{ background: 'var(--bg-secondary)' }}>HR - Manager</option>
                    )}
                  </select>
                </div>
              </>
            ) : (
              <div style={styles.inputGroup}>
                <label className="form-label" style={styles.label}>Link User Account</label>
                <select
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  required
                  className="form-input"
                  style={{ ...styles.input, background: 'var(--bg-secondary)', cursor: 'pointer' }}
                  disabled={loadingUsers}
                >
                  <option value="" style={{ background: 'var(--bg-secondary)' }}>
                    {loadingUsers ? 'Loading Users...' : users.length === 0 ? '— No Unlinked Users Found —' : '— Select User —'}
                  </option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id} style={{ background: 'var(--bg-secondary)' }}>
                      {u.email} ({u.role === 'TenantAdmin' ? 'HR - Manager' : u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Profile Information Segment */}
            <div style={styles.inputGroup}>
              <label className="form-label" style={styles.label}>First Name</label>
              <input
                name="firstName"
                type="text"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                required
                className="form-input"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label className="form-label" style={styles.label}>Last Name</label>
              <input
                name="lastName"
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                required
                className="form-input"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label className="form-label" style={styles.label}>Phone Number</label>
              <input
                name="phoneNumber"
                type="text"
                placeholder="+1 (555) 000-0000"
                value={form.phoneNumber}
                onChange={handleChange}
                className="form-input"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label className="form-label" style={styles.label}>Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="form-input"
                style={{ ...styles.input, background: 'var(--bg-secondary)', cursor: 'pointer' }}
              >
                <option value="Engineering" style={{ background: 'var(--bg-secondary)' }}>Engineering</option>
                <option value="Human Resources" style={{ background: 'var(--bg-secondary)' }}>Human Resources</option>
                <option value="Finance & Accounting" style={{ background: 'var(--bg-secondary)' }}>Finance & Accounting</option>
                <option value="Marketing" style={{ background: 'var(--bg-secondary)' }}>Marketing</option>
                <option value="Sales" style={{ background: 'var(--bg-secondary)' }}>Sales</option>
                <option value="Operations" style={{ background: 'var(--bg-secondary)' }}>Operations</option>
                <option value="IT & Security" style={{ background: 'var(--bg-secondary)' }}>IT & Security</option>
                <option value="Legal & Compliance" style={{ background: 'var(--bg-secondary)' }}>Legal & Compliance</option>
                <option value="Customer Success" style={{ background: 'var(--bg-secondary)' }}>Customer Success</option>
                <option value="Product Management" style={{ background: 'var(--bg-secondary)' }}>Product Management</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label className="form-label" style={styles.label}>Position</label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                className="form-input"
                style={{ ...styles.input, background: 'var(--bg-secondary)', cursor: 'pointer' }}
              >
                <option value="Software Engineer" style={{ background: 'var(--bg-secondary)' }}>Software Engineer</option>
                <option value="Senior Software Engineer" style={{ background: 'var(--bg-secondary)' }}>Senior Software Engineer</option>
                <option value="Quality Assurance Analyst" style={{ background: 'var(--bg-secondary)' }}>Quality Assurance Analyst</option>
                <option value="HR Specialist" style={{ background: 'var(--bg-secondary)' }}>HR Specialist</option>
                <option value="Recruitment Manager" style={{ background: 'var(--bg-secondary)' }}>Recruitment Manager</option>
                <option value="Financial Analyst" style={{ background: 'var(--bg-secondary)' }}>Financial Analyst</option>
                <option value="Marketing Specialist" style={{ background: 'var(--bg-secondary)' }}>Marketing Specialist</option>
                <option value="Sales Executive" style={{ background: 'var(--bg-secondary)' }}>Sales Executive</option>
                <option value="Product Manager" style={{ background: 'var(--bg-secondary)' }}>Product Manager</option>
                <option value="Customer Support Specialist" style={{ background: 'var(--bg-secondary)' }}>Customer Support Specialist</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label className="form-label" style={styles.label}>Joining Date</label>
              <input
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={handleChange}
                required
                className="form-input"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label className="form-label" style={styles.label}>Salary (optional)</label>
              <input
                name="salary"
                type="number"
                placeholder="50000"
                value={form.salary}
                onChange={handleChange}
                className="form-input"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.btnRow}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || (loadingUsers && !createAccountMode)}>
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  header: {},
  title: { fontSize: '24px', fontWeight: '800', color: '#f3f4f6' },
  sub: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  formCard: { padding: '32px', maxWidth: '800px' },
  modeTabs: { display: 'flex', gap: '10px', marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' },
  tabBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', color: '#9ca3af', fontWeight: '600', transition: 'var(--transition-smooth)' },
  activeTab: { background: 'var(--primary)', color: '#fff' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {},
  input: { width: '100%' },
  btnRow: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  errorAlert: { backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '12px', borderRadius: '6px', fontSize: '13px', marginBottom: '8px' },
};

export default AddEmployee;
