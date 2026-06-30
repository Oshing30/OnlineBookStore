import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

// Cart lives entirely in client state. It is sent to the backend only at
// checkout (POST /api/orders). Each item: { id, title, author, price, quantity }.
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addToCart(book) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === book.id);
      if (existing) {
        // Never exceed available stock.
        const next = Math.min(existing.quantity + 1, book.stockQuantity);
        return prev.map((i) =>
          i.id === book.id ? { ...i, quantity: next } : i
        );
      }
      // Only add if there's at least one in stock.
      if (book.stockQuantity < 1) return prev;
      return [...prev, { ...book, quantity: 1 }];
    });
  }

  function updateQuantity(id, quantity) {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        // Clamp between 1 and the book's available stock.
        const requested = Math.max(1, Number(quantity) || 1);
        const clamped = Math.min(requested, i.stockQuantity);
        return { ...i, quantity: clamped };
      })
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const totals = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return { count, subtotal };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeItem, clearCart, totals }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
