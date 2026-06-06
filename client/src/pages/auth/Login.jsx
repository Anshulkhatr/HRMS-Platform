import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../redux/auth/authSlice';
import { Shield, Mail, Lock, Cpu, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (tenantId) {
        localStorage.setItem('tenantId', tenantId);
      }
      
      // Navigate based on user role
      if (user.role === 'SuperAdmin') {
        navigate('/admin');
      } else if (user.role === 'TenantAdmin') {
        navigate('/admin');
      } else if (user.role === 'Manager') {
        navigate('/manager');
      } else {
        navigate('/employee');
      }
    }
  }, [isAuthenticated, user, navigate, tenantId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tenantId) {
      localStorage.setItem('tenantId', tenantId);
    }
    dispatch(login({ email, password }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.card} className="glass-panel">
        <div style={styles.header}>
          <Cpu size={32} color="#6366f1" />
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your workspace credentials</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label} className="form-label">Company Tenant ID (Optional)</label>
            <div style={styles.inputWrapper}>
              <Shield size={18} style={styles.icon} />
              <input
                type="text"
                placeholder="e.g. 642e88a..."
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                style={styles.input}
                className="form-input"
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input
                type="email"
                required
                placeholder="name@company.com"
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
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
              </button>
            </div>
          </div>

          <div style={styles.forgotPassContainer}>
            <Link to="/forgot-password" style={styles.forgotLink}>Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn} className="btn btn-primary">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have a workspace? <Link to="/register" style={styles.link}>Register Organization</Link>
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
    maxWidth: '420px',
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
    paddingRight: '44px',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    cursor: 'pointer',
  },
  forgotPassContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  forgotLink: {
    fontSize: '13px',
    color: '#6366f1',
    fontWeight: '500',
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

export default Login;
