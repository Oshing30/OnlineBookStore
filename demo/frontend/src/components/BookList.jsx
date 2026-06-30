import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(null);

  useEffect(() => {
    api
      .getBooks()
      .then((data) => {
        setBooks(data);
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, []);

  function handleAdd(book) {
    addToCart(book);
    setJustAdded(book.id);
    setTimeout(() => setJustAdded(null), 1200);
  }

  if (status === 'loading') return <p className="state">Loading the shelves…</p>;
  if (status === 'error')
    return (
      <p className="state state--error">
        Could not load books: {error}. Is the backend running on port 8080?
      </p>
    );
  if (books.length === 0) return <p className="state">No books on the shelf yet.</p>;

  return (
    <section>
      <h1 className="page-title">On the shelf</h1>
      <div className="book-grid">
        {books.map((book) => (
          <article key={book.id} className="book-card">
            <div className="book-card__spine" aria-hidden="true" />
            <div className="book-card__body">
              <h2 className="book-card__title">{book.title}</h2>
              <p className="book-card__author">{book.author}</p>
              <p
                className={
                  book.stockQuantity > 0
                    ? 'book-card__stock'
                    : 'book-card__stock book-card__stock--out'
                }
              >
                {book.stockQuantity > 0
                  ? `${book.stockQuantity} in stock`
                  : 'Out of stock'}
              </p>
            </div>
            <div className="book-card__foot">
              <span className="book-card__price">${book.price.toFixed(2)}</span>
              <button
                className="btn btn--solid"
                disabled={book.stockQuantity === 0}
                onClick={() => handleAdd(book)}
              >
                {justAdded === book.id ? 'Added ✓' : 'Add to cart'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
