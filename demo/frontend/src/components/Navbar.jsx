import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totals } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="nav">
      <Link to="/" className="nav__brand">
        The&nbsp;Marginalia
        <span className="nav__brand-sub">a small bookstore</span>
      </Link>

      <nav className="nav__links">
        <Link to="/">Catalog</Link>
        <Link to="/cart" className="nav__cart">
          Cart
          {totals.count > 0 && <span className="nav__badge">{totals.count}</span>}
        </Link>
        {user ? (
          <>
            <span className="nav__user">{user.username}</span>
            <button className="btn btn--ghost" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn--ghost">
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}
