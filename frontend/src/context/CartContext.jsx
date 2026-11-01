import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product, qty = 1, variant = null) => {
    setItems(prev => {
      const key = `${product.item_id}-${variant || 'default'}`;
      const existing = prev.find(i => i.key === key);

      if (existing) {
        return prev.map(i =>
          i.key === key ? { ...i, qty: i.qty + qty } : i
        );
      }

      return [...prev, {
        key,
        item_id: product.item_id,
        name: product.name,
        price: product.price,
        qty,
        variant,
        image_url: product.image_url,
      }];
    });
  }, []);

  const removeItem = useCallback((key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQty = useCallback((key, newQty) => {
    if (newQty <= 0) {
      setItems(prev => prev.filter(i => i.key !== key));
      return;
    }
    setItems(prev => prev.map(i =>
      i.key === key ? { ...i, qty: newQty } : i
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const addBundle = useCallback((bundleItems) => {
    setItems(prev => {
      const newItems = [...prev];
      bundleItems.forEach(product => {
        const key = `${product.item_id}-bundle`;
        const existing = newItems.find(i => i.key === key);
        if (!existing) {
          newItems.push({
            key,
            item_id: product.item_id,
            name: product.name,
            price: product.price,
            qty: product.qty || 1,
            variant: 'bundle',
            image_url: product.image_url,
          });
        }
      });
      return newItems;
    });
  }, []);

  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    const hasBundle = items.some(i => i.variant === 'bundle');
    const discount = hasBundle ? Math.round(subtotal * 0.15) : 0;
    const total = subtotal - discount;

    return { subtotal, itemCount, discount, total, hasBundle };
  }, [items]);

  const value = {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    addBundle,
    summary,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
