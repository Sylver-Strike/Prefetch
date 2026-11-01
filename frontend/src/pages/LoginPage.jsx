import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HoloCard from '../components/ui/HoloCard/HoloCard';
import './LoginPage.css';

const ROLES = [
  { id: 'STUDENT', label: 'Student', icon: 'school', clearance: 'Standard Clearance' },
  { id: 'STAFF', label: 'Staff & Clerk', icon: 'inventory_2', clearance: 'Terminal Operational Clearance' },
  { id: 'ADMIN', label: 'Store Admin', icon: 'admin_panel_settings', clearance: 'Tier 1 Master Privilege' },
];

const DEPARTMENTS = [
  { value: 'cs', label: 'Computer Science & Engineering' },
  { value: 'mech', label: 'Mechanical & Aerospace' },
  { value: 'ece', label: 'Electronics & Communication' },
  { value: 'bio', label: 'Biotechnology & Bio-Informatics' },
];

const COUNTERS = [
  { value: 'counter-a', label: 'Counter A — Uniforms & Engineering Toolkits' },
  { value: 'counter-b', label: 'Counter B — Textbooks & Academic Records' },
  { value: 'counter-c', label: 'Counter C — Express Pickups (Under 30s)' },
];

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState('STUDENT');
  const [authMethod, setAuthMethod] = useState('sso');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = loginDemo(activeRole);
      setToast(`PreFetch Session Authorized (${activeRole})`);

      setTimeout(() => {
        const routes = { STUDENT: '/store', STAFF: '/staff/orders', ADMIN: '/admin' };
        navigate(routes[activeRole] || '/store');
      }, 800);
    } catch (err) {
      setToast('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Toast notification */}
      {toast && (
        <div className="login-toast animate-slide-in" onAnimationEnd={() => setTimeout(() => setToast(null), 2000)}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
          <span>{toast}</span>
        </div>
      )}

      <main className="login-container">
        {/* Brand Header */}
        <div className="login-brand-bar">
          <div className="login-brand-left">
            <div className="login-brand-bolt">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>bolt</span>
            </div>
            <div className="login-brand-name">
              <span className="login-brand-pre">Pre</span>
              <span className="login-brand-fetch">Fetch</span>
            </div>
          </div>
          <div className="login-brand-status">
            <span className="live-dot" style={{ width: 8, height: 8 }}></span>
            <span className="text-mono-data">CO-OP HUB ONLINE</span>
          </div>
        </div>

        {/* Header Banner */}
        <div className="login-header">
          <div className="login-header-tags">
            <span className="badge" style={{ background: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}>Campus Division</span>
            <span className="text-mono-data" style={{ color: 'var(--color-on-surface-variant)' }}>NODE::CAMPUS-SEC-01</span>
          </div>
          <h1 className="text-headline-md" style={{ color: 'var(--color-on-surface)', marginBottom: 'var(--space-xs)' }}>
            Zero-Wait Campus Cooperative Store
          </h1>
          <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            Role-Based Access Control (RBAC) &amp; rapid pre-order dispatch station. Sign in below according to your designated campus authorization level.
          </p>
        </div>

        {/* HoloCard Accent */}
        <div className="login-holocard-wrap">
          <HoloCard
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuD3jSLnzdVSCCtPPiZS-8KamxYPMs_Bsrpa42nP4fZ9YcdgHPrJSwk94A6KBfkqG-PvhFVSSlVXbvDfWLtOUVEqat6H3lg7p5RHHozK2BE-hnC3R6x3jCZUbJzQfLAOhqgsi4fYqiwrVImMM_DJ4T6Y8hS8CF-3hq8wk6D-kFLB733qETek9aW534t8d9ownqWrqjSP92bqJ4CGf7TWc4gkmkQrp5vk-FYOAWqzJcuV"
            alt="PreFetch Campus ID"
            preset="gold"
            foilColor="#131B2E"
            width={220}
            intensity={0.7}
            edgeSparkle={0.6}
            frame={5}
            radius={8}
            idle={true}
            shadow={true}
          />
        </div>

        {/* Role Tabs */}
        <div className="login-role-tabs">
          <div className="login-role-tabs-inner">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`login-role-tab ${activeRole === role.id ? 'active' : ''}`}
                onClick={() => setActiveRole(role.id)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{role.icon}</span>
                <span>{role.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="login-form-area">
          <form className="login-form" onSubmit={handleLogin}>
            {/* Form header */}
            <div className="login-form-header">
              <div>
                <span className="text-label-sm" style={{ color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {ROLES.find(r => r.id === activeRole)?.clearance}
                </span>
                <h2 className="text-title" style={{ color: 'var(--color-on-surface)' }}>
                  {activeRole === 'STUDENT' ? 'Student Portal Login' :
                   activeRole === 'STAFF' ? 'Staff & Clerk Verification' :
                   'Store Administrator Console'}
                </h2>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: activeRole === 'ADMIN' ? 'var(--color-secondary-fixed)' : 'var(--color-secondary)' }}>
                {activeRole === 'STUDENT' ? 'badge' : activeRole === 'STAFF' ? 'storefront' : 'security'}
              </span>
            </div>

            {/* Student fields */}
            {activeRole === 'STUDENT' && (
              <>
                <div className="login-field">
                  <label className="text-label-md">Roll Number / Campus Email</label>
                  <div className="login-input-wrap">
                    <input className="input input-mono" type="text" defaultValue="CS2024098@campus.edu" placeholder="e.g. CS2024098@campus.edu" required />
                    <span className="material-symbols-outlined login-input-icon">person</span>
                  </div>
                </div>
                <div className="login-field">
                  <label className="text-label-md">Academic Department</label>
                  <select className="input">
                    {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <div className="login-auth-method">
                  <div className="login-auth-method-header">
                    <span className="text-label-sm">Authentication Method</span>
                    <div className="login-auth-method-btns">
                      <button type="button" className={`login-method-btn ${authMethod === 'sso' ? 'active' : ''}`} onClick={() => setAuthMethod('sso')}>SSO</button>
                      <button type="button" className={`login-method-btn ${authMethod === 'otp' ? 'active' : ''}`} onClick={() => setAuthMethod('otp')}>OTP SMS</button>
                    </div>
                  </div>
                  <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
                    {authMethod === 'sso' ? 'Institute Single Sign-On enabled with Campus Card integration.' : 'One-Time Password will be transmitted to enrolled student mobile number.'}
                  </p>
                </div>
                <div className="login-info-box">
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-secondary-container)' }}>offline_bolt</span>
                  <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Fast-Checkout Active: Pre-verified roll numbers skip identity validation at Pickup Locker Station B.
                  </p>
                </div>
              </>
            )}

            {/* Staff fields */}
            {activeRole === 'STAFF' && (
              <>
                <div className="login-field">
                  <label className="text-label-md">Staff Identity Code</label>
                  <div className="login-input-wrap">
                    <input className="input input-mono" type="text" defaultValue="STF-8842-COOP" placeholder="e.g. STF-8842-COOP" required />
                    <span className="material-symbols-outlined login-input-icon">badge</span>
                  </div>
                </div>
                <div className="login-field">
                  <label className="text-label-md">Assigned Service Counter</label>
                  <select className="input">
                    {COUNTERS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="login-field">
                  <label className="text-label-md">Clerk Security PIN</label>
                  <div className="login-input-wrap">
                    <input className="input input-mono" type="password" defaultValue="994411" placeholder="••••••" required style={{ letterSpacing: '0.25em' }} />
                    <span className="material-symbols-outlined login-input-icon">pin</span>
                  </div>
                </div>
              </>
            )}

            {/* Admin fields */}
            {activeRole === 'ADMIN' && (
              <>
                <div className="login-field">
                  <label className="text-label-md">Administrator Email</label>
                  <div className="login-input-wrap">
                    <input className="input input-mono" type="email" defaultValue="admin.director@campus.edu" placeholder="e.g. director.store@campus.edu" required />
                    <span className="material-symbols-outlined login-input-icon">verified_user</span>
                  </div>
                </div>
                <div className="login-field">
                  <label className="text-label-md">Master Security Key / 2FA Authenticator Token</label>
                  <div className="login-input-wrap">
                    <input className="input input-mono" type="password" defaultValue="PREFETCH-AUTH-SECKEY" placeholder="Hardware FIDO / TOTP Token" required />
                    <span className="material-symbols-outlined login-input-icon">key</span>
                  </div>
                </div>
                <div className="login-warning-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-error)' }}>warning</span>
                    <span className="text-label-md" style={{ fontWeight: 700 }}>Restricted Management Environment</span>
                  </div>
                  <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Session activity is tracked. Grants direct batch fulfillment approvals, manual price overrides, and warehouse replenishment.
                  </p>
                </div>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`btn ${activeRole === 'STAFF' ? 'btn-secondary' : 'btn-primary'}`}
              style={{ width: '100%', padding: 'var(--space-sm) var(--space-md)' }}
              disabled={loading}
            >
              <span>{activeRole === 'STUDENT' ? 'Authorize Student Pickup' : activeRole === 'STAFF' ? 'Access Dispatch Desk' : 'Authenticate Root Console'}</span>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                {activeRole === 'ADMIN' ? 'lock_open' : activeRole === 'STAFF' ? 'point_of_sale' : 'arrow_forward'}
              </span>
            </button>
          </form>
        </div>

        {/* Security banner */}
        <div className="login-security-banner">
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-secondary)' }}>gavel</span>
          <div>
            <p className="text-label-sm" style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              JWT Encrypted &amp; RBAC Governed
            </p>
            <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              Regulated under Campus Cooperative Store Security Standard v4.2
            </p>
          </div>
        </div>

        {/* Live metrics */}
        <div className="login-metrics-bar">
          <div className="login-metrics-header">
            <span className="text-label-sm" style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--color-surface)' }}>Campus Store Live Status</span>
            <span className="text-mono-data" style={{ color: 'var(--color-on-tertiary-container)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 'var(--radius-full)', background: 'var(--color-on-tertiary-container)' }}></span> LIVE
            </span>
          </div>
          <div className="login-metrics-grid">
            <div className="login-metric">
              <span className="text-headline-sm text-mono-data" style={{ color: 'var(--color-surface)' }}>420</span>
              <span className="text-body-sm" style={{ color: 'var(--color-on-primary-container)' }}>Pickups Today</span>
            </div>
            <div className="login-metric">
              <span className="text-headline-sm text-mono-data" style={{ color: 'var(--color-secondary-container)' }}>28s</span>
              <span className="text-body-sm" style={{ color: 'var(--color-on-primary-container)' }}>Avg Collection</span>
            </div>
            <div className="login-metric">
              <span className="text-headline-sm text-mono-data" style={{ color: 'var(--color-surface)' }}>98%</span>
              <span className="text-body-sm" style={{ color: 'var(--color-on-primary-container)' }}>Stock Ready</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
