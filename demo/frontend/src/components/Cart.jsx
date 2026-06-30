import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
    const { items, updateQuantity, removeItem, totals } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <section className="empty">
                <h1 className="page-title">Your cart</h1>
                <p className="state">Your cart is empty.</p>
                <Link to="/" className="btn btn--solid">
                    Browse the catalog
                </Link>
            </section>
        );
    }

    function proceed() {
        // Checkout requires authentication; bounce to login if needed.
        if (!user) {
            navigate('/login', { state: { from: '/checkout' } });
        } else {
            navigate('/checkout');
        }
    }

    return (
        <section>
            <h1 className="page-title">Your cart</h1>
            <ul className="cart-list">
                {items.map((item) => (
                    <li key={item.id} className="cart-row">
                        <div className="cart-row__info">
                            <span className="cart-row__title">{item.title}</span>
                            <span className="cart-row__author">{item.author}</span>
                        </div>
                        <div className="cart-row__qty">
                            <button
                                className="qty-btn"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                min="1"
                                max={item.stockQuantity}
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, e.target.value)}
                            />
                            <button
                                className="qty-btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stockQuantity}
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                        {item.quantity >= item.stockQuantity && (
                            <span className="cart-row__max">Max stock reached</span>
                        )}
                        <span className="cart-row__line">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
                        <button
                            className="btn btn--ghost btn--small"
                            onClick={() => removeItem(item.id)}
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            <div className="cart-summary">
                <span>Subtotal ({totals.count} items)</span>
                <strong>${totals.subtotal.toFixed(2)}</strong>
            </div>

            <div className="cart-actions">
                <Link to="/" className="btn btn--ghost">
                    Keep shopping
                </Link>
                <button className="btn btn--solid" onClick={proceed}>
                    {user ? 'Proceed to checkout' : 'Log in to checkout'}
                </button>
            </div>
        </section>
    );
}
