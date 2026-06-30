Online Bookstore (React + Spring Boot)

A simple online bookstore: browse books, build a cart, register/log in, 
and check out. JWT-based authentication; checkout requires being logged in.

.
├── src/    # Spring Boot 3 + H2 REST API (Java 17)
└── frontend/   # React 18 + Vite SPA


Architecture at a glance

- Cart lives in the React frontend (client-side state) and is sent to the 
- backend only at checkout. There is no /api/cart endpoint because, even 
- with authentication, a client-side cart is simpler and avoids sync issues. 
- If you need a persistent server-side cart, add Cart/CartItem entities + 
- a CartController — see the note in bookstore-backend/README.md.
- Auth is JWT. Passwords are BCrypt-hashed. A request filter validates the 
- Bearer token on protected routes. GET /api/books and /api/auth/** are 
- public; POST /api/orders requires a valid token.

Run order

1. Backend (port 8080)

cd src
mvn spring-boot:run


Seeds sample books on startup. H2 console at http://localhost:8080/h2-console 
(JDBC URL jdbc:h2:mem:bookstoredb, user sa, blank password).

2. Frontend (port 3000)

cd frontend
npm install
npm run dev


Open http://localhost:3000. The frontend talks to http://localhost:8080 
by default; override with a .env file (see .env.example).

End-to-end flow to demo

1. Browse the catalog (no login needed).
2. Add books to the cart; adjust quantities; remove items.
3. Click checkout → you're prompted to log in.
4. Register a new account (or log in).
5. Place the order → see the confirmation summary with order id and total.

API summary
Method	Path	Auth	Success	Errors
GET	/api/books	no	200	—
GET	/api/books/{id}	no	200	404
POST	/api/auth/register	no	201	400, 409
POST	/api/auth/login	no	200	400, 401
POST	/api/orders	yes	201	400, 401, 404

Security note
app.jwt.secret in application.properties is a placeholder. Replace it with 
a long random value (≥ 32 chars) and load it from an environment variable 
before deploying anywhere real.
