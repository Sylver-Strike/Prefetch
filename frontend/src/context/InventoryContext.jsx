import { createContext, useContext, useEffect, useState } from 'react';

export const INITIAL_INVENTORY = [
  { item_id: 'CS301-BK', name: 'Data Structures & Algorithms Lab Manual', category: 'Textbooks', department: 'Computer Science', stock: 14, threshold: 5, price: 260, variants: ['Hardbound Spiral', 'Standard Glue'], sku: 'CS301-BK', image_url: '' },
  { item_id: 'CS-APRN-M', name: 'CSE Department Lab Apron', category: 'Uniforms', department: 'Computer Science', stock: 22, threshold: 8, price: 320, variants: ['S', 'M', 'L', 'XL'], sku: 'CS-APRN-M', image_url: '' },
  { item_id: 'MECH-DRW-KIT', name: 'Engineering Drawing Precision Kit', category: 'Academic Kits', department: 'Mechanical', stock: 3, threshold: 5, price: 580, variants: null, sku: 'MECH-DRW', image_url: '' },
  { item_id: 'ECE-BREAD', name: 'Electronics Breadboard + Wire Kit', category: 'Lab Records', department: 'Electronics', stock: 0, threshold: 5, price: 150, variants: ['Standard', 'Extended'], sku: 'ECE-BRD1', image_url: '' },
  { item_id: 'GEN-PEN-SET', name: 'Technical Drawing Pen Set (0.1-0.8mm)', category: 'Stationery', department: 'General', stock: 48, threshold: 10, price: 220, variants: null, sku: 'GEN-PENS', image_url: '' },
  { item_id: 'BIO-LABCOAT', name: 'Bio-Safety Lab Coat (Class II)', category: 'Uniforms', department: 'Biotechnology', stock: 8, threshold: 5, price: 450, variants: ['S', 'M', 'L', 'XL'], sku: 'BIO-LC2', image_url: '' },
  { item_id: 'CS-ALGO-REF', name: 'CLRS — Introduction to Algorithms (4th Ed)', category: 'Textbooks', department: 'Computer Science', stock: 6, threshold: 5, price: 860, variants: ['Paperback', 'Hardcover'], sku: 'CS-CLRS4', image_url: '' },
  { item_id: 'GEN-CALC', name: 'Scientific Calculator FX-991EX', category: 'Stationery', department: 'General', stock: 31, threshold: 10, price: 1200, variants: null, sku: 'GEN-CALC', image_url: '' },
];

const STORAGE_KEY = 'prefetch_inventory';
const InventoryContext = createContext(null);

function readInventory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_INVENTORY;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error('Saved inventory must be an array.');

    const savedById = new Map(
      parsed
        .filter(item => item && typeof item.item_id === 'string' && Number.isInteger(item.stock) && item.stock >= 0)
        .map(item => [item.item_id, item])
    );
    return INITIAL_INVENTORY.map(item => {
      const savedItem = savedById.get(item.item_id);
      return savedItem ? { ...item, stock: savedItem.stock } : item;
    });
  } catch (error) {
    console.error('Unable to load saved inventory.', error);
    return INITIAL_INVENTORY;
  }
}

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(readInventory);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory.map(({ item_id, stock }) => ({ item_id, stock }))));
    } catch (error) {
      console.error('Unable to save inventory changes.', error);
    }
  }, [inventory]);

  const updateStock = (itemId, stock) => {
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error('Stock must be a non-negative whole number.');
    }
    if (!inventory.some(item => item.item_id === itemId)) {
      throw new Error(`Unknown inventory item: ${itemId}`);
    }
    setInventory(items => items.map(item => item.item_id === itemId ? { ...item, stock } : item));
  };

  return (
    <InventoryContext.Provider value={{ inventory, updateStock }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
}
