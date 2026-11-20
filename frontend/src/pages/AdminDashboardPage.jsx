import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import './AdminDashboardPage.css';

const PENDING_USERS = [
  { id: 'u1', name: 'Karthik R.', email: 'ME2025012@campus.edu', dept: 'Mechanical', role: 'STUDENT', date: '2025-10-14' },
  { id: 'u2', name: 'Sneha J.', email: 'BT2025034@campus.edu', dept: 'Biotechnology', role: 'STUDENT', date: '2025-10-14' },
  { id: 'u3', name: 'Mohan P.', email: 'staff.mohan@campus.edu', dept: 'Store Ops', role: 'STAFF', date: '2025-10-13' },
];

const ACCOUNTS = [
  { id: 'a1', name: 'Rahul Sharma', uid: 'CS2024098', dept: 'Computer Science', role: 'STUDENT', lastAuth: '14:26 today', status: 'ACTIVE' },
  { id: 'a2', name: 'R. Sen', uid: 'STF-8842', dept: 'Store Ops', role: 'STAFF', lastAuth: '14:31 today', status: 'ACTIVE' },
  { id: 'a3', name: 'Ananya K.', uid: 'EC2024011', dept: 'Electronics', role: 'STUDENT', lastAuth: '13:22 today', status: 'ACTIVE' },
  { id: 'a4', name: 'Devi P.', uid: 'ME2024077', dept: 'Mechanical', role: 'STUDENT', lastAuth: '2 days ago', status: 'IDLE' },
];

function StockBadge({ stock, threshold }) {
  if (stock === 0) return <span className="badge status-error">Depleted</span>;
  if (stock <= threshold) return <span className="badge status-pending">Low · {stock}</span>;
  return <span className="badge status-ready">OK · {stock}</span>;
}

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { inventory, updateStock } = useInventory();
  const [activeTab, setActiveTab] = useState('access');
  const [pendingUsers, setPendingUsers] = useState(PENDING_USERS);
  const [restockItem, setRestockItem] = useState(null);
  const [stockInput, setStockInput] = useState('');
  const [stockError, setStockError] = useState('');
  const [searchAccounts, setSearchAccounts] = useState('');
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [editingAccount, setEditingAccount] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [accessMessage, setAccessMessage] = useState('');

  const metrics = useMemo(() => [
    { label: 'Active Accounts', value: accounts.filter(account => account.status === 'ACTIVE').length, icon: 'group', color: 'var(--color-on-surface)' },
    { label: 'Pending Auths', value: pendingUsers.length, icon: 'pending_actions', color: 'var(--color-secondary-container)' },
    { label: 'Inventory Items', value: inventory.length, icon: 'inventory', color: 'var(--color-on-tertiary-container)' },
    { label: 'Stock Alerts', value: inventory.filter(item => item.stock <= item.threshold).length, icon: 'warning', color: 'var(--color-error)' },
  ], [accounts, inventory, pendingUsers]);

  const handleApprove = (userId) => {
    const approvedUser = pendingUsers.find(user => user.id === userId);
    if (!approvedUser) return;
    setAccounts(prev => [...prev, {
      id: `approved-${approvedUser.id}`,
      name: approvedUser.name,
      uid: approvedUser.email.split('@')[0],
      dept: approvedUser.dept,
      role: approvedUser.role,
      lastAuth: 'Never',
      status: 'ACTIVE',
    }]);
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    setAccessMessage(`${approvedUser.name} was approved and added to the accounts directory.`);
  };

  const handleReject = (userId) => {
    const rejectedUser = pendingUsers.find(user => user.id === userId);
    if (!rejectedUser) return;
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    setAccessMessage(`${rejectedUser.name}'s authorization request was rejected.`);
  };

  const openStockEditor = (item, action) => {
    setRestockItem({ ...item, action });
    setStockInput(action === 'adjust' ? String(item.stock) : '');
    setStockError('');
  };

  const closeStockEditor = () => {
    setRestockItem(null);
    setStockInput('');
    setStockError('');
  };

  const handleStockSave = (event) => {
    event.preventDefault();
    const value = Number(stockInput);
    if (!restockItem || stockInput.trim() === '' || !Number.isInteger(value) || value < (restockItem.action === 'restock' ? 1 : 0)) {
      setStockError(restockItem?.action === 'restock'
        ? 'Enter a whole number of units to add (at least 1).'
        : 'Enter a whole number of units (0 or more).');
      return;
    }

    updateStock(restockItem.item_id, restockItem.action === 'restock' ? restockItem.stock + value : value);
    closeStockEditor();
  };

  const handlePrivilegesSave = (event) => {
    event.preventDefault();
    setAccounts(prev => prev.map(account => account.id === editingAccount.id ? { ...account, role: selectedRole } : account));
    setEditingAccount(null);
  };

  const handleAccountRevoke = (account) => {
    setAccounts(prev => prev.map(item => item.id === account.id
      ? { ...item, status: item.status === 'REVOKED' ? 'ACTIVE' : 'REVOKED' }
      : item));
  };

  const filteredAccounts = accounts.filter(a =>
    !searchAccounts || a.name.toLowerCase().includes(searchAccounts.toLowerCase()) || a.uid.toLowerCase().includes(searchAccounts.toLowerCase())
  );

  return (
    <div className="admin-page">
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
          <button className={`staff-nav-btn ${activeTab === 'access' ? 'active' : ''}`} onClick={() => setActiveTab('access')}>
            <span className="material-symbols-outlined">admin_panel_settings</span> Access Control
          </button>
          <button className={`staff-nav-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            <span className="material-symbols-outlined">inventory</span> Inventory
          </button>
          <button className={`staff-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <span className="material-symbols-outlined">analytics</span> Analytics
          </button>
        </nav>
        <div className="staff-sidebar-footer">
          <div className="staff-sidebar-user">
            <div className="store-header-avatar" style={{ width: 32, height: 32, background: 'var(--color-error)' }}>{user?.username?.[0] || 'A'}</div>
            <div>
              <p className="text-label-md" style={{ color: 'var(--color-surface)' }}>{user?.username}</p>
              <p className="text-mono-data" style={{ color: 'var(--color-secondary-fixed)', fontSize: 10 }}>ROLE: ADMIN</p>
            </div>
          </div>
          <button className="store-header-icon" onClick={() => { logout(); navigate('/login'); }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-on-primary-container)' }}>logout</span>
          </button>
        </div>
      </aside>

      <main className="staff-main">
        {/* Header */}
        <div className="staff-top-bar">
          <div>
            <h1 className="text-headline-md">Store Administration Console</h1>
            <p className="text-body-sm" style={{ color: 'var(--color-outline)' }}>Master Access Control & Inventory Management</p>
          </div>
          <span className="badge" style={{ background: 'var(--color-error)', color: 'var(--color-on-error)' }}>ADMIN TIER 1</span>
        </div>

        {/* Metrics row */}
        <div className="admin-metrics-row">
          {metrics.map((m, i) => (
            <div key={i} className="admin-metric-tile card">
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: m.color }}>{m.icon}</span>
              <span className="text-headline-sm text-mono-data" style={{ color: m.color }}>{m.value}</span>
              <span className="text-label-sm" style={{ color: 'var(--color-outline)' }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* Concurrency health banner */}
        <div className="admin-concurrency-banner">
          <div className="admin-concurrency-left">
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-on-tertiary-container)' }}>verified</span>
            <div>
              <p className="text-label-md" style={{ color: 'var(--color-surface)' }}>Atomic Concurrency Engine Status: <span style={{ color: 'var(--color-on-tertiary-container)' }}>HEALTHY</span></p>
              <p className="text-mono-data" style={{ color: 'var(--color-on-primary-container)', fontSize: 11 }}>Active Locks: 0 · Snapshot Drift: 0ms · Last Heartbeat: 2s ago</p>
            </div>
          </div>
          <span className="text-mono-data" style={{ color: 'var(--color-on-primary-container)' }}>db.runTransaction()</span>
        </div>

        {/* Access Control Tab */}
        {activeTab === 'access' && (
          <div className="admin-access-section">
            {accessMessage && <p className="admin-form-message" role="status">{accessMessage}</p>}
            {/* Pending Approvals */}
            <div className="admin-section">
              <h2 className="text-title" style={{ marginBottom: 'var(--space-sm)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'text-bottom' }}>pending_actions</span> Pending Authorizations ({pendingUsers.length})
              </h2>
              {pendingUsers.length === 0 ? (
                <p className="text-body-sm" style={{ color: 'var(--color-outline)', padding: 'var(--space-md)', textAlign: 'center' }}>No pending authorizations</p>
              ) : (
                <div className="admin-pending-grid">
                  {pendingUsers.map(u => (
                    <div key={u.id} className="admin-pending-card card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                        <div className="store-header-avatar" style={{ width: 36, height: 36 }}>{u.name[0]}</div>
                        <div>
                          <p className="text-label-md">{u.name}</p>
                          <p className="text-mono-data" style={{ color: 'var(--color-outline)', fontSize: 11 }}>{u.email}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
                        <span className="badge" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>{u.dept}</span>
                        <span className="badge" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>{u.role}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                        <button className="btn btn-success" style={{ flex: 1, fontSize: 12, padding: '6px' }} onClick={() => handleApprove(u.id)}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span> Approve
                        </button>
                        <button className="btn btn-error" style={{ flex: 1, fontSize: 12, padding: '6px' }} onClick={() => handleReject(u.id)}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accounts Directory */}
            <div className="admin-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                <h2 className="text-title">
                  <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'text-bottom' }}>group</span> Accounts Directory
                </h2>
                <div className="catalog-search-wrap" style={{ marginBottom: 0, width: 240 }}>
                  <span className="material-symbols-outlined catalog-search-icon">search</span>
                  <input className="input catalog-search" type="text" placeholder="Search accounts..." value={searchAccounts} onChange={e => setSearchAccounts(e.target.value)} />
                </div>
              </div>
              <div className="admin-accounts-table-wrap">
                <table className="admin-accounts-table">
                  <thead>
                    <tr>
                      <th>User & ID</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Last Auth</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                            <div className="store-header-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{a.name[0]}</div>
                            <div>
                              <p className="text-label-md" style={{ fontSize: 13 }}>{a.name}</p>
                              <p className="text-mono-data" style={{ color: 'var(--color-outline)', fontSize: 11 }}>{a.uid}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-body-sm">{a.dept}</td>
                        <td><span className="badge" style={{ background: a.role === 'ADMIN' ? 'var(--color-error)' : a.role === 'STAFF' ? 'var(--color-secondary)' : 'var(--color-primary)', color: 'var(--color-on-primary)' }}>{a.role}</span></td>
                        <td className="text-mono-data" style={{ fontSize: 12 }}>{a.lastAuth}</td>
                        <td><span className={`badge ${a.status === 'ACTIVE' ? 'status-ready' : a.status === 'REVOKED' ? 'status-error' : 'status-collected'}`}>{a.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button
                              className="btn btn-outline"
                              style={{ padding: '4px 8px', fontSize: 11 }}
                              onClick={() => { setEditingAccount(a); setSelectedRole(a.role); }}
                            >
                              Privileges
                            </button>
                            <button
                              className="btn btn-outline"
                              style={{ padding: '4px 8px', fontSize: 11, color: a.status === 'REVOKED' ? 'var(--color-on-tertiary-container)' : 'var(--color-error)', borderColor: a.status === 'REVOKED' ? 'var(--color-on-tertiary-container)' : 'var(--color-error)' }}
                              onClick={() => handleAccountRevoke(a)}
                            >
                              {a.status === 'REVOKED' ? 'Restore' : 'Revoke'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="admin-inventory-section">
            <div className="admin-section">
              <h2 className="text-title" style={{ marginBottom: 'var(--space-sm)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'text-bottom' }}>inventory</span> Inventory Management
              </h2>

              {/* Stock editor */}
              {restockItem && (
                <div className="admin-restock-drawer animate-fade-in">
                  <h3 className="text-label-md" style={{ marginBottom: 'var(--space-sm)' }}>
                    {restockItem.action === 'restock' ? 'Restock' : 'Adjust stock'}: {restockItem.name} ({restockItem.item_id})
                  </h3>
                  <form onSubmit={handleStockSave}>
                    <div className="admin-stock-editor-row">
                      <div className="login-field" style={{ flex: 1 }}>
                        <label className="text-label-sm" htmlFor="stock-adjustment">
                          {restockItem.action === 'restock' ? 'Units to Add' : 'New stock level'}
                        </label>
                        <input
                          id="stock-adjustment"
                          className="input input-mono"
                          type="number"
                          min={restockItem.action === 'restock' ? 1 : 0}
                          step="1"
                          value={stockInput}
                          onChange={event => { setStockInput(event.target.value); setStockError(''); }}
                          placeholder={restockItem.action === 'restock' ? 'Units to add' : String(restockItem.stock)}
                          aria-invalid={Boolean(stockError)}
                          aria-describedby={stockError ? 'stock-error' : undefined}
                        />
                      </div>
                      <button className="btn btn-success" type="submit" style={{ height: 44 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span> Save
                      </button>
                      <button className="btn btn-outline" type="button" onClick={closeStockEditor} style={{ height: 44 }}>Cancel</button>
                    </div>
                    {stockError && <p id="stock-error" className="admin-form-error" role="alert">{stockError}</p>}
                  </form>
                </div>
              )}

              <div className="admin-accounts-table-wrap">
                <table className="admin-accounts-table">
                  <thead>
                    <tr>
                      <th>Item Code</th>
                      <th>Details</th>
                      <th>Category</th>
                      <th>Stock Level</th>
                      <th>Unit Price</th>
                      <th>Txn Lock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => (
                      <tr key={item.item_id}>
                        <td className="text-mono-data" style={{ fontWeight: 700 }}>{item.item_id}</td>
                        <td className="text-body-sm">{item.name}</td>
                        <td><span className="badge" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>{item.category}</span></td>
                        <td><StockBadge stock={item.stock} threshold={item.threshold} /></td>
                        <td className="text-mono-data">₹{item.price}</td>
                        <td>
                          {item.stock === 0 ? (
                            <span className="badge status-error" style={{ fontSize: 10 }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>lock</span> LOCKED
                            </span>
                          ) : (
                            <span className="badge status-ready" style={{ fontSize: 10 }}>FREE</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => openStockEditor(item, 'restock')}>
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span> Restock
                            </button>
                            <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => openStockEditor(item, 'adjust')}>Adjust</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="admin-section">
            <h2 className="text-title" style={{ marginBottom: 'var(--space-sm)' }}>Inventory Overview</h2>
            <div className="admin-metrics-row">
              <div className="admin-metric-tile card">
                <span className="text-headline-sm text-mono-data">{inventory.reduce((total, item) => total + item.stock, 0)}</span>
                <span className="text-label-sm">Units in stock</span>
              </div>
              <div className="admin-metric-tile card">
                <span className="text-headline-sm text-mono-data">{inventory.filter(item => item.stock === 0).length}</span>
                <span className="text-label-sm">Depleted items</span>
              </div>
              <div className="admin-metric-tile card">
                <span className="text-headline-sm text-mono-data">{inventory.filter(item => item.stock > 0 && item.stock <= item.threshold).length}</span>
                <span className="text-label-sm">Low-stock items</span>
              </div>
              <div className="admin-metric-tile card">
                <span className="text-headline-sm text-mono-data">₹{inventory.reduce((total, item) => total + item.stock * item.price, 0).toLocaleString('en-IN')}</span>
                <span className="text-label-sm">Inventory value</span>
              </div>
            </div>
            <div className="admin-accounts-table-wrap">
              <table className="admin-accounts-table">
                <thead><tr><th>Item</th><th>Category</th><th>Units</th><th>Stock value</th></tr></thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.item_id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td><StockBadge stock={item.stock} threshold={item.threshold} /></td>
                      <td className="text-mono-data">₹{(item.stock * item.price).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      {editingAccount && (
        <div className="admin-dialog-backdrop" onMouseDown={event => event.target === event.currentTarget && setEditingAccount(null)}>
          <form
            className="admin-dialog card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-privileges-title"
            onSubmit={handlePrivilegesSave}
          >
            <h2 id="account-privileges-title" className="text-title">Edit privileges</h2>
            <p className="text-body-sm">Choose the role for {editingAccount.name} ({editingAccount.uid}).</p>
            <label className="login-field">
              <span className="text-label-sm">Account role</span>
              <select className="input" value={selectedRole} onChange={event => setSelectedRole(event.target.value)}>
                <option value="STUDENT">Student</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
            <div className="admin-dialog-actions">
              <button className="btn btn-outline" type="button" onClick={() => setEditingAccount(null)}>Cancel</button>
              <button className="btn btn-primary" type="submit">Save privileges</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
