import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Checkout() {
  const { items, totals, clearCart } = useCart();
  const { user } = useAuth();
  const [status, setStatus] = useState('review'); // review | placing | done | error
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  // Guard: never reachable without auth.
  if (!user) return <Navigate to="/login" replace />;

  if (items.length === 0 && status !== 'done') {
    return <Navigate to="/cart" replace />;
  }

  async function placeOrder() {
    setStatus('placing');
    setError('');
    try {
      const payload = items.map((i) => ({ bookId: i.id, quantity: i.quantity }));
      const result = await api.checkout(payload);
      setOrder(result);
      clearCart();
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  if (status === 'done' && order) {
    return (
      <section className="confirm">
        <h1 className="page-title">Order confirmed</h1>
        <p className="confirm__id">Order #{order.orderId}</p>
        <ul className="confirm__items">
          {order.items.map((line) => (
            <li key={line.bookId}>
              <span>
                {line.title} × {line.quantity}
              </span>
              <span>${line.lineTotal.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="cart-summary">
          <span>Total paid</span>
          <strong>${order.totalAmount.toFixed(2)}</strong>
        </div>
        <Link to="/" className="btn btn--solid">
          Back to catalog
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="page-title">Order summary</h1>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-row cart-row--review">
            <span className="cart-row__title">{item.title}</span>
            <span>× {item.quantity}</span>
            <span className="cart-row__line">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <span>Total ({totals.count} items)</span>
        <strong>${totals.subtotal.toFixed(2)}</strong>
      </div>

      {status === 'error' && <p className="state state--error">{error}</p>}

      <div className="cart-actions">
        <Link to="/cart" className="btn btn--ghost">
          Back to cart
        </Link>
        <button
          className="btn btn--solid"
          onClick={placeOrder}
          disabled={status === 'placing'}
        >
          {status === 'placing' ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </section>
  );
}
