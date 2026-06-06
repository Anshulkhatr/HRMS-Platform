import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerTenant } from '../../api/authApi';
import { Shield, Mail, Lock, Cpu, Building } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [domain, setDomain] = useState('');
  const [role, setRole] = useState('TenantAdmin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await registerTenant({ email, password, tenantName, domain, role });
      setSuccess('Workspace registered successfully! Redirecting...');
      if (result.data?.tenant?._id) {
        localStorage.setItem('tenantId', result.data.tenant._id);
      }
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.card} className="glass-panel">
        <div style={styles.header}>
          <Cpu size={32} color="#6366f1" />
          <h2 style={styles.title}>Register Workspace</h2>
          <p style={styles.subtitle}>Setup a new organization tenant</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label} className="form-label">Company Name</label>
            <div style={styles.inputWrapper}>
              <Building size={18} style={styles.icon} />
              <input
                type="text"
                required
                placeholder="Acme Corp"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                style={styles.input}
                className="form-input"
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} className="form-label">Custom Domain (Optional)</label>
            <div style={styles.inputWrapper}>
              <Shield size={18} style={styles.icon} />
              <input
                type="text"
                placeholder="acme.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={styles.input}
                className="form-input"
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} className="form-label">Admin Role</label>
            <div style={styles.inputWrapper}>
              <Shield size={18} style={styles.icon} />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ ...styles.input, background: 'var(--bg-secondary)', cursor: 'pointer', width: '100%' }}
                className="form-input"
              >
                <option value="TenantAdmin" style={{ background: 'var(--bg-secondary)' }}>HR - Manager</option>
                <option value="SuperAdmin" style={{ background: 'var(--bg-secondary)' }}>Super Admin</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} className="form-label">Admin Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input
                type="email"
                required
                placeholder="admin@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                className="form-input"
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} className="form-label">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn} className="btn btn-primary">
            {loading ? 'Provisioning...' : 'Provision Tenant'}
          </button>
        </form>

        <div style={styles.footer}>
          Already have a workspace? <Link to="/login" style={styles.link}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070a13',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)',
    zIndex: 0,
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    padding: '40px 32px',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '14px',
    color: '#6b7280',
    pointerEvents: 'none',
  },
  input: {
    paddingLeft: '44px',
  },
  submitBtn: {
    width: '100%',
    marginTop: '8px',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  successAlert: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    color: '#10b981',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#9ca3af',
  },
  link: {
    color: '#6366f1',
    fontWeight: '600',
  },
};

export default Register;
