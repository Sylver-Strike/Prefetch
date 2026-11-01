import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './StudentStorePage.css';

// Demo catalog data — will be replaced by API calls in Phase 2 backend integration
const CATALOG = [
  { item_id: 'CS301-BK', name: 'Data Structures & Algorithms Lab Manual', category: 'Textbooks', department: 'Computer Science', stock: 14, price: 260, image_url: '', variants: ['Hardbound Spiral', 'Standard Glue'], sku: 'CS301-BK' },
  { item_id: 'CS-APRN-M', name: 'CSE Department Lab Apron', category: 'Uniforms', department: 'Computer Science', stock: 22, price: 320, image_url: '', variants: ['S', 'M', 'L', 'XL'], sku: 'CS-APRN-M' },
  { item_id: 'MECH-DRW-KIT', name: 'Engineering Drawing Precision Kit', category: 'Academic Kits', department: 'Mechanical', stock: 3, price: 580, image_url: '', variants: null, sku: 'MECH-DRW' },
  { item_id: 'ECE-BREAD', name: 'Electronics Breadboard + Wire Kit', category: 'Lab Records', department: 'Electronics', stock: 0, price: 150, image_url: '', variants: ['Standard', 'Extended'], sku: 'ECE-BRD1' },
  { item_id: 'GEN-PEN-SET', name: 'Technical Drawing Pen Set (0.1-0.8mm)', category: 'Stationery', department: 'General', stock: 48, price: 220, image_url: '', variants: null, sku: 'GEN-PENS' },
  { item_id: 'BIO-LABCOAT', name: 'Bio-Safety Lab Coat (Class II)', category: 'Uniforms', department: 'Biotechnology', stock: 8, price: 450, image_url: '', variants: ['S', 'M', 'L', 'XL'], sku: 'BIO-LC2' },
  { item_id: 'CS-ALGO-REF', name: 'CLRS — Introduction to Algorithms (4th Ed)', category: 'Textbooks', department: 'Computer Science', stock: 6, price: 860, image_url: '', variants: ['Paperback', 'Hardcover'], sku: 'CS-CLRS4' },
  { item_id: 'GEN-CALC', name: 'Scientific Calculator FX-991EX', category: 'Stationery', department: 'General', stock: 31, price: 1200, image_url: '', variants: null, sku: 'GEN-CALC' },
];

const AI_BUNDLE = {
  title: 'Semester 3 — Computer Science Complete Kit',
  items: [CATALOG[0], CATALOG[1], CATALOG[4]],
  originalPrice: 800,
  bundlePrice: 680,
};

const CATEGORIES = ['All Items', 'Textbooks', 'Lab Records', 'Uniforms', 'Stationery', 'Academic Kits'];

function StockBadge({ stock }) {
  if (stock === 0) return <span className="badge status-error">Out of Stock</span>;
  if (stock <= 5) return <span className="badge status-pending">Low Stock · {stock}</span>;
  return <span className="badge status-ready">In Stock · {stock}</span>;
}

function ProductCard({ product, onAdd }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);

  return (
    <div className="product-card card">
      <div className="product-card-img">
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline-variant)' }}>
          {product.category === 'Textbooks' ? 'menu_book' :
           product.category === 'Uniforms' ? 'checkroom' :
           product.category === 'Lab Records' ? 'science' :
           product.category === 'Academic Kits' ? 'construction' : 'edit'}
        </span>
      </div>
      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="text-mono-data" style={{ color: 'var(--color-outline)' }}>{product.sku}</span>
          <StockBadge stock={product.stock} />
        </div>
        <h3 className="text-title" style={{ fontSize: 14 }}>{product.name}</h3>
        {product.variants && (
          <div className="product-variants">
            {product.variants.map(v => (
              <button
                key={v}
                type="button"
                className={`product-variant-btn ${selectedVariant === v ? 'active' : ''}`}
                onClick={() => setSelectedVariant(v)}
              >
                {v}
              </button>
            ))}
          </div>
        )}
        <div className="product-card-footer">
          <span className="text-headline-sm" style={{ fontFamily: 'var(--font-mono)' }}>₹{product.price}</span>
          <button
            className="btn btn-primary"
            disabled={product.stock === 0}
            onClick={() => onAdd(product, 1, selectedVariant)}
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_shopping_cart</span>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentStorePage() {
  const { user, logout } = useAuth();
  const { items, addItem, removeItem, updateQty, clearCart, addBundle, summary } = useCart();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderToken, setOrderToken] = useState(null);

  const filteredCatalog = useMemo(() => {
    return CATALOG.filter(item => {
      const matchCategory = activeCategory === 'All Items' || item.category === activeCategory;
      const matchSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCheckout = () => {
    const token = `PF-${String(Math.floor(Math.random() * 9000 + 1000))}`;
    setOrderToken({
      code: token,
      dispatch: 'DISP-B4',
      time: '0842',
      pin: String(Math.floor(Math.random() * 9000 + 1000)),
    });
    setShowCheckout(true);
  };

  const upiLink = `upi://pay?pa=campuscoop@okaxis&pn=PreFetchStore&am=${summary.total}&cu=INR&tn=Order-PreFetch`;

  return (
    <div className="store-page">
      {/* Header */}
      <header className="store-header">
        <div className="store-header-inner">
          <div className="store-header-left">
            <div className="login-brand-bolt" style={{ padding: '2px 6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>bolt</span>
            </div>
            <div className="login-brand-name" style={{ fontSize: 16 }}>
              <span className="login-brand-pre" style={{ fontSize: 16 }}>Pre</span>
              <span className="login-brand-fetch" style={{ fontSize: 16 }}>Fetch</span>
            </div>
            <span className="badge" style={{ background: 'var(--color-secondary)', color: 'var(--color-on-secondary)', marginLeft: 8 }}>S3 2025-26</span>
          </div>
          <div className="store-header-right">
            <button className="store-header-icon" title="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="store-header-avatar" title={user?.username}>
              {user?.username?.[0] || 'U'}
            </div>
            <button className="store-header-icon" title="Sign out" onClick={() => { logout(); navigate('/login'); }}>
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
        <div className="store-ticker">
          <span className="live-dot"></span>
          <span className="text-mono-data">PreFetch Station Active</span>
          <span className="text-mono-data" style={{ color: 'var(--color-outline)', marginLeft: 'auto' }}>Campus Co-operative Store</span>
        </div>
      </header>

      <main className="store-main">
        {/* Left column: catalog */}
        <div className="store-catalog-col">
          {/* AI Bundle Banner */}
          <div className="bundle-banner">
            <div className="bundle-banner-header">
              <span className="badge" style={{ background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>auto_awesome</span> AI Matched
              </span>
              <span className="text-label-sm" style={{ color: 'var(--color-on-primary-container)' }}>Syllabus Intelligence v2</span>
            </div>
            <h2 className="text-headline-sm" style={{ color: 'var(--color-surface)', margin: 'var(--space-sm) 0 var(--space-xs)' }}>
              {AI_BUNDLE.title}
            </h2>
            <div className="bundle-items-row">
              {AI_BUNDLE.items.map(item => (
                <span key={item.item_id} className="bundle-item-pill">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span> {item.name.split(' ').slice(0, 3).join(' ')}
                </span>
              ))}
            </div>
            <div className="bundle-price-row">
              <span>
                <span className="text-body-sm" style={{ color: 'var(--color-on-primary-container)', textDecoration: 'line-through' }}>₹{AI_BUNDLE.originalPrice}</span>
                <span className="text-headline-sm" style={{ color: 'var(--color-secondary-container)', marginLeft: 8, fontFamily: 'var(--font-mono)' }}>₹{AI_BUNDLE.bundlePrice}</span>
              </span>
              <button className="btn btn-secondary" onClick={() => addBundle(AI_BUNDLE.items)} style={{ padding: '6px 12px', fontSize: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>shopping_bag</span> Add Complete Bundle
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="catalog-controls">
            <div className="catalog-search-wrap">
              <span className="material-symbols-outlined catalog-search-icon">search</span>
              <input className="input catalog-search" type="text" placeholder="Search items, SKUs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="catalog-filter-pills">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`catalog-filter-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="catalog-grid">
            {filteredCatalog.map(product => (
              <ProductCard key={product.item_id} product={product} onAdd={addItem} />
            ))}
            {filteredCatalog.length === 0 && (
              <div className="catalog-empty">
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-outline-variant)' }}>search_off</span>
                <p className="text-body-md" style={{ color: 'var(--color-outline)' }}>No items found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: cart */}
        <div className="store-cart-col">
          <div className="cart-panel">
            <div className="cart-header">
              <h2 className="text-title">
                <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'text-bottom' }}>shopping_cart</span> Your Cart
              </h2>
              <span className="badge" style={{ background: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}>{summary.itemCount} Items</span>
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-outline-variant)' }}>remove_shopping_cart</span>
                <p className="text-body-sm" style={{ color: 'var(--color-outline)' }}>No items in cart yet</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {items.map(item => (
                    <div key={item.key} className="cart-item animate-fade-in">
                      <div className="cart-item-info">
                        <span className="text-label-md">{item.name}</span>
                        <span className="text-mono-data" style={{ color: 'var(--color-outline)' }}>
                          {item.variant && item.variant !== 'bundle' ? item.variant : ''} · ₹{item.price}
                        </span>
                      </div>
                      <div className="cart-item-controls">
                        <button className="cart-qty-btn" onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                        <span className="text-mono-data">{item.qty}</span>
                        <button className="cart-qty-btn" onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                        <button className="cart-remove-btn" onClick={() => removeItem(item.key)}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="cart-summary">
                  <div className="cart-summary-line">
                    <span className="text-body-sm">Subtotal</span>
                    <span className="text-mono-data">₹{summary.subtotal}</span>
                  </div>
                  {summary.hasBundle && (
                    <div className="cart-summary-line" style={{ color: 'var(--color-on-tertiary-container)' }}>
                      <span className="text-body-sm">AI Bundle Rebate (15%)</span>
                      <span className="text-mono-data">−₹{summary.discount}</span>
                    </div>
                  )}
                  <div className="cart-summary-line">
                    <span className="text-body-sm">Dispensary Fee</span>
                    <span className="text-mono-data" style={{ color: 'var(--color-on-tertiary-container)' }}>FREE</span>
                  </div>
                  <div className="cart-summary-total">
                    <span className="text-title">Total Payable</span>
                    <span className="text-headline-sm" style={{ fontFamily: 'var(--font-mono)' }}>₹{summary.total}</span>
                  </div>
                </div>

                {/* Checkout / UPI */}
                {!showCheckout ? (
                  <button className="btn btn-secondary" style={{ width: '100%', padding: '10px' }} onClick={handleCheckout}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>qr_code_2</span>
                    Proceed to UPI Checkout
                  </button>
                ) : (
                  <div className="checkout-panel animate-fade-in">
                    {/* QR Code */}
                    <div className="checkout-qr">
                      <QRCodeSVG value={upiLink} size={160} bgColor="transparent" fgColor="#0B1C30" />
                      <p className="text-body-sm" style={{ color: 'var(--color-outline)', marginTop: 8, textAlign: 'center' }}>
                        Scan with Google Pay / PhonePe
                      </p>
                    </div>

                    {/* UPI Deep-links */}
                    <div className="checkout-upi-btns">
                      <a href={upiLink} className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', fontSize: 12 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>payments</span> Google Pay
                      </a>
                      <a href={upiLink} className="btn btn-outline" style={{ flex: 1, textDecoration: 'none', fontSize: 12 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>account_balance</span> PhonePe
                      </a>
                    </div>

                    {/* Pickup Token */}
                    {orderToken && (
                      <div className="checkout-token">
                        <span className="text-label-sm" style={{ color: 'var(--color-on-primary-container)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Digital Pickup Token</span>
                        <span className="text-headline-lg" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-secondary-container)' }}>{orderToken.code}</span>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 4 }}>
                          <span className="text-mono-data" style={{ color: 'var(--color-on-primary-container)' }}>{orderToken.dispatch} · {orderToken.time}</span>
                          <span className="text-mono-data" style={{ color: 'var(--color-on-primary-container)' }}>PIN: {orderToken.pin}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
