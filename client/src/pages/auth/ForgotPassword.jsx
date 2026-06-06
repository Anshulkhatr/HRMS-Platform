import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Cpu } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Password reset link sent to ' + email);
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.card} className="glass-panel">
        <div style={styles.header}>
          <Cpu size={32} color="#6366f1" />
          <h2 style={styles.title}>Forgot Password</h2>
          <p style={styles.subtitle}>Enter email to receive reset link</p>
        </div>

        {success && <div style={styles.successAlert}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
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

          <button type="submit" style={styles.submitBtn} className="btn btn-primary">
            Send Reset Instructions
          </button>
        </form>

        <div style={styles.footer}>
          Remember your password? <Link to="/login" style={styles.link}>Sign In</Link>
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
  },
  submitBtn: {
    width: '100%',
    marginTop: '8px',
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

export default ForgotPassword;
