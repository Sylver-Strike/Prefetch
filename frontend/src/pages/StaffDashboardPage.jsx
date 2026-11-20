import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './StaffDashboardPage.css';

const DEMO_ORDERS = [
  { order_id: 'PF-8924', student: 'Rahul Sharma', dept: 'CSE', items: ['DS Lab Manual', 'CSE Lab Apron'], total: 580, status: 'READY', time: '14:26', token: 'PF-8924', pin: '4281' },
  { order_id: 'PF-8931', student: 'Ananya K.', dept: 'ECE', items: ['Electronics Breadboard Kit'], total: 150, status: 'PREPARING', time: '14:31', token: 'PF-8931', pin: '7720' },
  { order_id: 'PF-8918', student: 'Devi P.', dept: 'MECH', items: ['Engineering Drawing Kit', 'Calculator FX-991EX'], total: 1780, status: 'QUEUED', time: '14:18', token: 'PF-8918', pin: '3394' },
  { order_id: 'PF-8900', student: 'Vikas M.', dept: 'BIO', items: ['Bio-Safety Lab Coat'], total: 450, status: 'COLLECTED', time: '13:52', token: 'PF-8900', pin: '1192' },
  { order_id: 'PF-8897', student: 'Priya N.', dept: 'CSE', items: ['CLRS Textbook', 'Pen Set'], total: 1080, status: 'COLLECTED', time: '13:45', token: 'PF-8897', pin: '6634' },
];

const STATUS_MAP = {
  READY: { label: 'Ready for Pickup', className: 'status-ready' },
  PREPARING: { label: 'Paid – Preparing', className: 'status-pending' },
  QUEUED: { label: 'Paid – Queued', className: 'status-pending' },
  COLLECTED: { label: 'Collected', className: 'status-collected' },
};

export default function StaffDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(DEMO_ORDERS[0]);
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [bagChecks, setBagChecks] = useState({});
  const [activeView, setActiveView] = useState('orders');
  const [tokenError, setTokenError] = useState('');
  const [showDiscrepancyForm, setShowDiscrepancyForm] = useState(false);
  const [discrepancyText, setDiscrepancyText] = useState('');
  const [discrepancyMessage, setDiscrepancyMessage] = useState('');

  const getVisibleOrders = (view, source = orders) => {
    if (view === 'history') return source.filter(order => order.status === 'COLLECTED');
    if (view === 'alerts') return source.filter(order => order.status !== 'COLLECTED' || order.discrepancy);
    return source;
  };
  const visibleOrders = getVisibleOrders(activeView);

  const stats = {
    pending: orders.filter(o => o.status === 'QUEUED' || o.status === 'PREPARING').length,
    bagging: orders.filter(o => o.status === 'PREPARING').length,
    handed: orders.filter(o => o.status === 'COLLECTED').length,
    avgSpeed: '28s',
  };

  const handleFetchToken = () => {
    const found = orders.find(o => o.token.toUpperCase() === tokenInput.trim().toUpperCase());
    if (found) {
      setSelectedOrder(found);
      setTokenError('');
      setDiscrepancyMessage('');
    } else {
      setTokenError('No order was found for that token.');
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    setSelectedOrder(getVisibleOrders(view)[0] || null);
    setShowDiscrepancyForm(false);
    setDiscrepancyText('');
    setDiscrepancyMessage('');
  };

  const handleCollect = (orderId) => {
    if (!selectedOrder?.items.every((_, index) => bagChecks[`${orderId}-${index}`])) return;
    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: 'COLLECTED' } : o));
    setSelectedOrder(prev => prev?.order_id === orderId ? { ...prev, status: 'COLLECTED' } : prev);
  };

  const toggleBagCheck = (orderId, itemIdx) => {
    setBagChecks(prev => ({
      ...prev,
      [`${orderId}-${itemIdx}`]: !prev[`${orderId}-${itemIdx}`],
    }));
  };

  const handleDiscrepancySubmit = (event) => {
    event.preventDefault();
    const note = discrepancyText.trim();
    if (!selectedOrder || !note) return;
    const updatedOrder = { ...selectedOrder, discrepancy: note };
    setOrders(prev => prev.map(order => order.order_id === selectedOrder.order_id ? updatedOrder : order));
    setSelectedOrder(updatedOrder);
    setDiscrepancyText('');
    setShowDiscrepancyForm(false);
    setDiscrepancyMessage('Discrepancy recorded for this order.');
  };

  return (
    <div className="staff-page">
      {/* Sidebar */}
      <aside className="staff-sidebar">
        <div className="staff-sidebar-brand">
          <div className="login-brand-bolt" style={{ padding: '2px 6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>bolt</span>
          </div>
          <div className="login-brand-name" style={{ fontSize: 14 }}>
            <span className="login-brand-pre" style={{ fontSize: 14 }}>Pre</span>
            <span className="login-brand-fetch" style={{ fontSize: 14 }}>Fetch</span>
          </div>
        </div>
        <nav className="staff-nav">
          <button className={`staff-nav-btn ${activeView === 'orders' ? 'active' : ''}`} onClick={() => handleViewChange('orders')}>
            <span className="material-symbols-outlined">inventory_2</span> Orders
          </button>
          <button className={`staff-nav-btn ${activeView === 'history' ? 'active' : ''}`} onClick={() => handleViewChange('history')}>
            <span className="material-symbols-outlined">history</span> History
          </button>
          <button className={`staff-nav-btn ${activeView === 'alerts' ? 'active' : ''}`} onClick={() => handleViewChange('alerts')}>
            <span className="material-symbols-outlined">notifications</span> Alerts
          </button>
        </nav>
        <div className="staff-sidebar-footer">
          <div className="staff-sidebar-user">
            <div className="store-header-avatar" style={{ width: 32, height: 32 }}>{user?.username?.[0] || 'S'}</div>
            <div>
              <p className="text-label-md" style={{ color: 'var(--color-surface)' }}>{user?.username}</p>
              <p className="text-mono-data" style={{ color: 'var(--color-on-primary-container)', fontSize: 10 }}>ROLE: LOGISTICS</p>
            </div>
          </div>
          <button className="store-header-icon" onClick={() => { logout(); navigate('/login'); }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-on-primary-container)' }}>logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="staff-main">
        {/* Header */}
        <div className="staff-top-bar">
          <div>
            <h1 className="text-headline-md">Order Fulfillment Terminal</h1>
            <p className="text-body-sm" style={{ color: 'var(--color-outline)' }}>PreFetch Dispatch Console — Counter B</p>
          </div>
          <div className="staff-token-search">
            <div className="catalog-search-wrap" style={{ marginBottom: 0 }}>
              <span className="material-symbols-outlined catalog-search-icon">qr_code_scanner</span>
              <input
                className="input catalog-search input-mono"
                type="text"
                placeholder="Scan or enter token..."
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFetchToken()}
              />
            </div>
            <button className="btn btn-secondary" onClick={handleFetchToken} style={{ whiteSpace: 'nowrap' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>search</span> Fetch Token
            </button>
          </div>
        </div>
        {tokenError && <p className="staff-inline-message" role="alert">{tokenError}</p>}

        {/* Quick stats */}
        <div className="staff-stats-strip">
          <div className="staff-stat">
            <span className="text-headline-sm text-mono-data" style={{ color: 'var(--color-secondary-container)' }}>{stats.pending}</span>
            <span className="text-label-sm">Pending</span>
          </div>
          <div className="staff-stat">
            <span className="text-headline-sm text-mono-data" style={{ color: 'var(--color-secondary)' }}>{stats.bagging}</span>
            <span className="text-label-sm">In Bagging</span>
          </div>
          <div className="staff-stat">
            <span className="text-headline-sm text-mono-data" style={{ color: 'var(--color-on-tertiary-container)' }}>{stats.handed}</span>
            <span className="text-label-sm">Handed Over</span>
          </div>
          <div className="staff-stat">
            <span className="text-headline-sm text-mono-data">{stats.avgSpeed}</span>
            <span className="text-label-sm">Avg Speed</span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="staff-columns">
          {/* Order queue */}
          <div className="staff-queue-col">
            <h2 className="text-title" style={{ marginBottom: 'var(--space-sm)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'text-bottom' }}>list_alt</span>{' '}
              {activeView === 'history' ? 'Collected Orders' : activeView === 'alerts' ? 'Order Alerts' : 'Order Queue'}
            </h2>
            <div className="staff-order-list">
              {visibleOrders.map(order => (
                <button
                  type="button"
                  key={order.order_id}
                  className={`staff-order-card card ${selectedOrder?.order_id === order.order_id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDiscrepancyForm(false);
                    setDiscrepancyText('');
                    setDiscrepancyMessage('');
                  }}
                  aria-pressed={selectedOrder?.order_id === order.order_id}
                >
                  <div className="staff-order-card-top">
                    <span className="text-mono-data" style={{ fontWeight: 700 }}>{order.order_id}</span>
                    <span className={`badge ${STATUS_MAP[order.status].className}`}>{STATUS_MAP[order.status].label}</span>
                  </div>
                  <p className="text-label-md">{order.student}</p>
                  <div className="staff-order-card-meta">
                    <span className="text-body-sm" style={{ color: 'var(--color-outline)' }}>{order.dept} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    <span className="text-mono-data" style={{ color: 'var(--color-outline)' }}>₹{order.total}</span>
                  </div>
                  {order.discrepancy && <p className="staff-discrepancy-note">Issue: {order.discrepancy}</p>}
                </button>
              ))}
              {visibleOrders.length === 0 && <p className="staff-inline-message">No orders in this view.</p>}
            </div>
          </div>

          {/* Order detail / verification */}
          <div className="staff-detail-col">
            {selectedOrder ? (
              <>
                <div className="staff-detail-header">
                  <h2 className="text-title">Order Verification</h2>
                  <span className={`badge ${STATUS_MAP[selectedOrder.status].className}`}>{STATUS_MAP[selectedOrder.status].label}</span>
                </div>
                {discrepancyMessage && <p className="staff-inline-message" role="status">{discrepancyMessage}</p>}
                {selectedOrder.discrepancy && (
                  <p className="staff-discrepancy-note">Reported issue: {selectedOrder.discrepancy}</p>
                )}

                {/* Student card */}
                <div className="staff-student-card">
                  <div className="store-header-avatar" style={{ width: 48, height: 48, fontSize: 18 }}>{selectedOrder.student[0]}</div>
                  <div>
                    <p className="text-title">{selectedOrder.student}</p>
                    <p className="text-mono-data" style={{ color: 'var(--color-outline)' }}>Department: {selectedOrder.dept}</p>
                    <p className="text-mono-data" style={{ color: 'var(--color-outline)' }}>Token: {selectedOrder.token} · PIN: {selectedOrder.pin}</p>
                  </div>
                </div>

                {/* Bagging checklist */}
                <div className="staff-bagging">
                  <h3 className="text-label-md" style={{ marginBottom: 'var(--space-sm)' }}>Item Bagging Checklist</h3>
                  {selectedOrder.items.map((item, idx) => (
                    <label key={idx} className="staff-bag-item">
                      <input
                        type="checkbox"
                        checked={bagChecks[`${selectedOrder.order_id}-${idx}`] || false}
                        onChange={() => toggleBagCheck(selectedOrder.order_id, idx)}
                      />
                      <span className="text-body-md">{item}</span>
                    </label>
                  ))}
                </div>

                {/* Digital receipt */}
                <div className="staff-receipt">
                  <div className="staff-receipt-header">
                    <span className="text-label-sm" style={{ textTransform: 'uppercase' }}>Digital Receipt Preview</span>
                    <span className="text-mono-data">{selectedOrder.time}</span>
                  </div>
                  <div className="staff-receipt-body">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="staff-receipt-line">
                        <span className="text-body-sm">{item}</span>
                        <span className="text-mono-data">×1</span>
                      </div>
                    ))}
                    <div className="staff-receipt-total">
                      <span className="text-label-md">Total</span>
                      <span className="text-mono-data" style={{ fontWeight: 700 }}>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="staff-actions">
                  {selectedOrder.status !== 'COLLECTED' ? (
                    <button
                      className="btn btn-success"
                      style={{ flex: 2 }}
                      onClick={() => handleCollect(selectedOrder.order_id)}
                      disabled={!selectedOrder.items.every((_, index) => bagChecks[`${selectedOrder.order_id}-${index}`])}
                      title="Check off every item before completing handover."
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                      Handover & Complete Order
                    </button>
                  ) : (
                    <div className="staff-collected-msg">
                      <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--color-on-tertiary-container)' }}>task_alt</span>
                      <span className="text-label-md">Order Collected Successfully</span>
                    </div>
                  )}
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => window.print()}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>print</span>
                    Print Slip
                  </button>
                  <button className="btn btn-error" style={{ flex: 1 }} onClick={() => { setShowDiscrepancyForm(value => !value); setDiscrepancyMessage(''); }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>flag</span>
                    Discrepancy
                  </button>
                </div>
                {showDiscrepancyForm && (
                  <form className="staff-discrepancy-form" onSubmit={handleDiscrepancySubmit}>
                    <label className="login-field">
                      <span className="text-label-md">Describe the issue</span>
                      <textarea
                        className="input"
                        value={discrepancyText}
                        onChange={event => setDiscrepancyText(event.target.value)}
                        rows={3}
                        maxLength={500}
                        required
                      />
                    </label>
                    <div className="staff-discrepancy-actions">
                      <button type="button" className="btn btn-outline" onClick={() => { setShowDiscrepancyForm(false); setDiscrepancyText(''); }}>Cancel</button>
                      <button type="submit" className="btn btn-error">Record discrepancy</button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <div className="staff-no-selection">
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline-variant)' }}>touch_app</span>
                <p className="text-body-md" style={{ color: 'var(--color-outline)' }}>Select an order or scan a token to begin verification</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
