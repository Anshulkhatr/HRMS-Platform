import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Users, Clock, CalendarDays, ArrowRight, Activity, Cpu,
  BarChart3, Bell, FileText, CheckCircle, TrendingUp, Building2,
  ChevronRight, Star, Zap, Globe, Lock, Database, Play, UserCheck,
  Briefcase, Award, HeartHandshake, Menu, X
} from 'lucide-react';

/* ─── Animated counter ─── */
const Counter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const step = target / (duration / 16);
        let cur = 0;
        const timer = setInterval(() => {
          cur = Math.min(cur + step, target);
          setCount(Math.floor(cur));
          if (cur >= target) clearInterval(timer);
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Feature Card ─── */
const FeatureCard = ({ icon: Icon, color, title, desc, delay }) => (
  <div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px', animation: `slideUp 0.7s ease-out ${delay}s both` }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
      <Icon size={24} color={color} />
    </div>
    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f3f4f6' }}>{title}</h3>
    <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7 }}>{desc}</p>
  </div>
);

/* ─── Step Card ─── */
const StepCard = ({ number, title, desc }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
      {number}
    </div>
    <div>
      <h4 style={{ fontSize: 17, fontWeight: 700, color: '#f3f4f6', marginBottom: 6 }}>{title}</h4>
      <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7 }}>{desc}</p>
    </div>
  </div>
);

/* ─── Main Page ─── */
const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const headerOpacity = Math.min(scrollY / 100, 0.95);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070a13', color: '#f3f4f6', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' }}>

      {/* ── Ambient glow orbs ── */}
      <div style={{ position: 'fixed', top: '-5%', left: '5%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '-5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── Navbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 70,
        backgroundColor: `rgba(7,10,19,${headerOpacity})`,
        backdropFilter: 'blur(16px)',
        borderBottom: scrollY > 30 ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
            <Cpu size={20} color="#fff" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
            HRMS<span style={{ background: 'linear-gradient(135deg,#a5b4fc,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Platform</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          <a href="#features" style={{ padding: '8px 16px', color: '#9ca3af', fontSize: 14, fontWeight: 600, borderRadius: 8, transition: 'color 0.2s', cursor: 'pointer', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = '#f3f4f6'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>
            Features
          </a>
          <a href="#howitworks" style={{ padding: '8px 16px', color: '#9ca3af', fontSize: 14, fontWeight: 600, borderRadius: 8, transition: 'color 0.2s', cursor: 'pointer', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = '#f3f4f6'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>
            How It Works
          </a>
          <a href="#stats" style={{ padding: '8px 16px', color: '#9ca3af', fontSize: 14, fontWeight: 600, borderRadius: 8, transition: 'color 0.2s', cursor: 'pointer', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = '#f3f4f6'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>
            Stats
          </a>
          <Link to="/login" style={{ padding: '8px 20px', color: '#9ca3af', fontSize: 14, fontWeight: 600, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s', textDecoration: 'none' }}
            onMouseEnter={e => { e.target.style.color = '#f3f4f6'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.target.style.color = '#9ca3af'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
            Sign In
          </Link>
          <Link to="/register" style={{ padding: '8px 20px', fontSize: 14, fontWeight: 700, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', transition: 'all 0.2s', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.boxShadow = '0 6px 20px rgba(99,102,241,0.55)'}
            onMouseLeave={e => e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'}>
            Get Started Free →
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', alignItems: 'center', justifyContent: 'center', padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: '#9ca3af' }}
          className="mobile-only-flex"
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ── Mobile Slide-Down Menu ── */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 70, left: 0, right: 0, zIndex: 99,
          background: 'rgba(7,10,19,0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 8,
          animation: 'slideUp 0.25s ease-out forwards'
        }}>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 16px', color: '#d1d5db', fontSize: 15, fontWeight: 600, borderRadius: 8, textDecoration: 'none', display: 'block' }}>Features</a>
          <a href="#howitworks" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 16px', color: '#d1d5db', fontSize: 15, fontWeight: 600, borderRadius: 8, textDecoration: 'none', display: 'block' }}>How It Works</a>
          <a href="#stats" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 16px', color: '#d1d5db', fontSize: 15, fontWeight: 600, borderRadius: 8, textDecoration: 'none', display: 'block' }}>Stats</a>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 16px', color: '#9ca3af', fontSize: 15, fontWeight: 600, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', textAlign: 'center' }}>Sign In</Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 16px', fontSize: 15, fontWeight: 700, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', textDecoration: 'none', textAlign: 'center' }}>Get Started Free →</Link>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto' }}>
          <div className="hero-grid">
            {/* Left – Text */}
            <div style={{ animation: 'slideUp 0.9s ease-out both' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', marginBottom: 28 }} className="animate-float">
                <Activity size={15} color="#06b6d4" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#06b6d4' }}>Next-Gen Multi-Tenant HRMS</span>
              </div>
              <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24 }}>
                Manage Your <br />
                <span style={{ background: 'linear-gradient(135deg,#a5b4fc 0%,#6366f1 50%,#06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Workforce Smarter</span> <br />
                Than Ever Before.
              </h1>
              <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#9ca3af', lineHeight: 1.75, maxWidth: 500, marginBottom: 40 }}>
                A complete HR management platform that handles employee records, real-time attendance, leave workflows, approvals, reports, and analytics — all from one unified dashboard.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 24px rgba(99,102,241,0.4)', textDecoration: 'none', transition: 'all 0.2s' }}>
                  Start Free Trial <ArrowRight size={18} />
                </Link>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#d1d5db', fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'all 0.2s' }}>
                  Sign In to Workspace
                </Link>
              </div>
              {/* Trust badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                  <CheckCircle size={16} color="#10b981" />
                  Multi-tenant isolation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                  <CheckCircle size={16} color="#10b981" />
                  Role-based access
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                  <CheckCircle size={16} color="#10b981" />
                  JWT secured
                </div>
              </div>
            </div>

            {/* Right – Dashboard Mockup */}
            <div style={{ animation: 'fadeIn 1.2s ease-out 0.3s both' }}>
              <div style={{ background: 'rgba(17,24,39,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)' }}>
                {/* Window chrome */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ marginLeft: 12, fontSize: 12, color: '#4b5563', fontWeight: 600 }}>HRMS Platform — Admin Dashboard</span>
                </div>
                {/* Stat rows */}
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { icon: Users, color: '#6366f1', label: 'Total Employees', val: '1,248' },
                      { icon: Clock, color: '#06b6d4', label: 'Present Today', val: '98.4%' },
                      { icon: CalendarDays, color: '#10b981', label: 'Leaves Pending', val: '14' },
                      { icon: TrendingUp, color: '#f59e0b', label: 'Monthly Growth', val: '+12%' },
                    ].map((s, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, animation: `slideUp 0.6s ease-out ${0.4 + i * 0.1}s both` }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <s.icon size={18} color={s.color} />
                        </div>
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6' }}>{s.val}</div>
                          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Live feed */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, animation: 'slideUp 0.6s ease-out 0.8s both' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Live Activity Feed</div>
                    {[
                      { dot: '#10b981', text: 'Alice Smith clocked in — 9:02 AM', time: 'just now' },
                      { dot: '#6366f1', text: 'Bob Johnson leave approved', time: '3m ago' },
                      { dot: '#f59e0b', text: 'Late arrival alert: Carol White', time: '8m ago' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: '#9ca3af', flex: 1 }}>{item.text}</span>
                        <span style={{ fontSize: 11, color: '#4b5563' }}>{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section id="stats" style={{ padding: '60px 24px', background: 'rgba(99,102,241,0.04)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', position: 'relative', zIndex: 1 }}>
        <div className="stats-grid" style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {[
            { label: 'Employees Managed', val: 50000, suffix: '+', color: '#6366f1' },
            { label: 'Organizations Trust Us', val: 1200, suffix: '+', color: '#06b6d4' },
            { label: 'Attendance Records', val: 5000000, suffix: '+', color: '#10b981' },
            { label: 'Uptime Guarantee', val: 99, suffix: '.9%', color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '20px 0' }}>
              <div style={{ fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 900, color: s.color, letterSpacing: '-2px' }}>
                <Counter target={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 14, color: '#6b7280', fontWeight: 600, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 20 }}>
              <Zap size={14} color="#6366f1" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Powerful Features</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16 }}>
              Everything Your HR Team Needs
            </h2>
            <p style={{ fontSize: 17, color: '#9ca3af', maxWidth: 600, margin: '0 auto' }}>
              From onboarding to exit, manage every stage of your employee lifecycle with our all-in-one HRMS platform.
            </p>
          </div>
          <div className="features-grid">
            <FeatureCard icon={Users} color="#6366f1" title="Employee Management" desc="Full employee lifecycle — hire, onboard, update profiles, manage departments, positions, salaries, and track status changes." delay={0.0} />
            <FeatureCard icon={Clock} color="#06b6d4" title="Smart Attendance Tracking" desc="Real-time punch in/out with late detection, daily summaries, regularization workflows, and exportable CSV reports." delay={0.1} />
            <FeatureCard icon={CalendarDays} color="#10b981" title="Leave Management" desc="Multi-type leave policies (Sick, Casual, Maternity, Paternity, Unpaid) with automatic balance tracking and accruals." delay={0.2} />
            <FeatureCard icon={CheckCircle} color="#f59e0b" title="Approval Workflows" desc="Multi-level leave approval queue for Managers and Admins with instant notifications and one-click decisions." delay={0.3} />
            <FeatureCard icon={BarChart3} color="#a78bfa" title="Reports & Analytics" desc="Generate attendance summaries and leave reports as downloadable CSV files. Track headcount and workforce trends." delay={0.4} />
            <FeatureCard icon={Shield} color="#34d399" title="Multi-Tenant Security" desc="Each organization gets an isolated workspace with their own domain. JWT authentication with role-based access control." delay={0.5} />
            <FeatureCard icon={Bell} color="#f472b6" title="Notifications Center" desc="Real-time alerts for attendance anomalies, pending approvals, upcoming leave decisions, and system events." delay={0.6} />
            <FeatureCard icon={FileText} color="#60a5fa" title="Document Management" desc="Upload, organize, and retrieve employee documents securely. Cloudinary-powered with local fallback support." delay={0.7} />
            <FeatureCard icon={Database} color="#fb923c" title="Audit Logs" desc="Every action is tracked. Complete audit trail for compliance, security reviews, and accountability across your organization." delay={0.8} />
          </div>
        </div>
      </section>

      {/* ── Roles Section ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 14 }}>Built for Every Role</h2>
            <p style={{ color: '#9ca3af', fontSize: 17, maxWidth: 550, margin: '0 auto' }}>Purpose-built dashboards and permissions for every member of your organization.</p>
          </div>
          <div className="roles-grid">
            {[
              {
                icon: Building2, color: '#6366f1', role: 'Tenant Admin',
                perks: ['Provision organization workspaces', 'Manage all employees & users', 'Full access to all modules', 'View organization-wide reports', 'Configure leave policies']
              },
              {
                icon: UserCheck, color: '#06b6d4', role: 'Manager',
                perks: ['View and manage team members', 'Approve or reject leave requests', 'Monitor team attendance', 'Access department reports', 'Receive real-time notifications']
              },
              {
                icon: Briefcase, color: '#10b981', role: 'Employee',
                perks: ['Punch in & out with live clock', 'Apply for various leave types', 'Track personal leave balance', 'View attendance history', 'Access personal documents']
              }
            ].map((r, i) => (
              <div key={i} className="glass-card" style={{ padding: 32 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${r.color}15`, border: `1px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <r.icon size={26} color={r.color} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>{r.role}</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {r.perks.map((p, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#9ca3af' }}>
                      <CheckCircle size={15} color={r.color} style={{ flexShrink: 0 }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="howitworks" style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', marginBottom: 20 }}>
              <Play size={14} color="#06b6d4" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#06b6d4' }}>Get Started In Minutes</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 14 }}>How It Works</h2>
            <p style={{ color: '#9ca3af', fontSize: 17 }}>Go from zero to a fully operational HR workspace in three simple steps.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <StepCard number="01" title="Register Your Organization" desc="Sign up and provision your unique tenant workspace. Each organization gets an isolated environment with its own subdomain, users, and data." />
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }} />
            <StepCard number="02" title="Add Employees & Configure Roles" desc="Invite your team by creating user accounts with the appropriate roles — Admin, Manager, or Employee. Set up departments, positions, and leave policies." />
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }} />
            <StepCard number="03" title="Go Live & Track Everything" desc="Employees start clocking in, applying for leaves, and managers begin reviewing approvals. Real-time dashboards and reports keep you informed." />
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
            <HeartHandshake size={36} color="#fff" />
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 20 }}>
            Ready to Transform <br />
            <span style={{ background: 'linear-gradient(135deg,#a5b4fc,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Your HR Operations?</span>
          </h2>
          <p style={{ fontSize: 18, color: '#9ca3af', lineHeight: 1.7, marginBottom: 40 }}>
            Join organizations already managing their workforce smarter with HRMS Platform. No setup fees. No credit card required.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', fontWeight: 800, fontSize: 16, boxShadow: '0 8px 32px rgba(99,102,241,0.45)', textDecoration: 'none' }}>
              Create Free Workspace <ArrowRight size={20} />
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#d1d5db', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={15} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#9ca3af' }}>HRMS Platform</span>
          </div>
          <p style={{ fontSize: 13, color: '#4b5563' }}>© 2026 HRMS Platform. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link to="/login" style={{ fontSize: 13, color: '#4b5563', textDecoration: 'none' }}>Sign In</Link>
            <Link to="/register" style={{ fontSize: 13, color: '#4b5563', textDecoration: 'none' }}>Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
