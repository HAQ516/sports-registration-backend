# Sports Day Registration System — Backend

A REST API backend for a university Sports Day Registration System, built with **Express**, **MongoDB (Mongoose)**, and **JWT authentication** (via httpOnly cookies).

> This README describes the project **as it currently exists in this repo**. Some features from the original assignment spec (sport CRUD, student registration/payment, cancellation) are not implemented yet — see [Current Status & Roadmap](#current-status--roadmap) for exactly what's there and what's missing.

---

## Tech Stack

- **Express 5** — web framework
- **Mongoose 9** — MongoDB ODM
- **jsonwebtoken** — auth tokens
- **bcryptjs** — password hashing (⚠️ see [Known Issue](#known-issue-missing-dependency) below)
- **cookie-parser** — reads the JWT from httpOnly cookies
- **dotenv** — environment variables

## Project Structure

```
sports-registration-backend/
├── server.js                    # Entry point: loads env, connects DB, starts server
├── package.json
├── src/
│   ├── app.js                   # Express app setup, mounts all routers
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── User.js               # name, email, phone, password, role
│   │   ├── Sport.js               # name, fee, venue, event_date, is_active
│   │   └── Registration.js        # user_id, sport_id, payment_ref, payment_status
│   ├── middleware/
│   │   ├── protect.js             # verifies JWT cookie, attaches req.user
│   │   └── isAdmin.js             # role-based access guard
│   ├── controllers/
│   │   ├── authController.js       # register, login, logout
│   │   ├── studentController.js     # home, dashboard, browse sports, my registrations
│   │   └── adminController.js       # dashboard stats, list sports, view registrations
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   └── adminRoutes.js
│   └── utils/
│       └── generateToken.js         # signs the JWT
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local instance or MongoDB Atlas)

### Installation

```bash
git clone https://github.com/HAQ516/sports-registration-backend.git
cd sports-registration-backend
npm install
```

### Known Issue: missing dependency

`src/controllers/authController.js` imports `bcryptjs`, but it is **not currently listed in `package.json`**. Right after `npm install`, also run:

```bash
npm install bcryptjs
```

Otherwise registration/login will crash with `Cannot find module 'bcryptjs'`. (Worth committing this fix so future clones don't hit the same wall.)

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sports_day
JWT_SECRET=replace-with-a-long-random-string
```

⚠️ Note the exact variable name is **`MONGODB_URI`** (not `MONGO_URI`) — that's what `src/config/db.js` reads.

If you're on a network that blocks `mongodb+srv://` DNS (SRV) lookups — common on some campus/office networks and shows up as a `querySrv ECONNREFUSED` error — `src/config/db.js` already points Node's DNS resolver at Google/Cloudflare DNS (`8.8.8.8`, `1.1.1.1`) to work around it. If that alone doesn't fix it, switch to the non-SRV standard connection string from your Atlas dashboard instead.

`.env` is already covered by `.gitignore` — never commit it.

### Run the server

```bash
npm start
```

Server runs at `http://localhost:5000`.

There's no `nodemon`/dev script configured yet — you'll need to restart manually after changes, or add nodemon yourself:
```bash
npm install -D nodemon
# then add to package.json scripts: "dev": "nodemon server.js"
```

## Authentication Model

- Stateless JWT auth — no session store.
- On login/register, a JWT containing `{ id }` is signed and set as an **httpOnly cookie** named `token`.
- `protect` middleware (`src/middleware/protect.js`) reads that cookie, verifies it, loads the user from the DB, and attaches it to `req.user`.
- `isAdmin('admin')` middleware (`src/middleware/isAdmin.js`) is a **factory function** — it takes a comma-separated string of allowed roles and returns the actual middleware. That's why routes call it as `isAdmin('admin')`, not just `isAdmin`.
- Logout simply clears the cookie (`res.clearCookie('token')`).

**Frontend integration note:** since the token is an httpOnly cookie, any frontend calling this API must send requests with `credentials: 'include'` (fetch) or `withCredentials: true` (axios), or the cookie won't be attached and every protected route will return `401`.

## API Reference (as currently implemented)

Note the route prefixes are **not consistent** across routers — this is worth cleaning up later (see Roadmap):

- Auth routes are mounted at `/api/auth`
- Student routes are mounted at `/` (root, no prefix)
- Admin routes are mounted at `/admin`

### Auth — `/api/auth`

| Method | Endpoint | Access | Body |
|---|---|---|---|
| POST | `/api/auth/register` | Public | `{ name, email, phone, password, role? }` |
| POST | `/api/auth/login` | Public | `{ email, password }` |
| POST | `/api/auth/logout` | Public | — |

### Student — `/` (root)

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | `/` | Public | Lists active sports (home page data) |
| GET | `/dashboard` | Logged in | Summary counts + own registrations |
| GET | `/sports` | Logged in | Browse active sports |
| GET | `/my-registrations` | Logged in | Own registrations, sport details populated |

### Admin — `/admin`

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | `/admin/dashboard` | Admin only | Aggregate stats + last 10 registrations |
| GET | `/admin/sports` | Admin only | All sports (active + inactive) |
| GET | `/admin/registrations` | Admin only | Optional `?payment_status=` filter |

## Data Model

```
User  1───N  Registration  N───1  Sport
```

- `Registration.user_id` and `Registration.sport_id` are Mongoose refs (foreign keys) pointing at `User` and `Sport`.
- **Not yet enforced:** the original spec requires a unique constraint on `(user_id, sport_id)` so a student can't register for the same sport twice. This isn't currently on the `Registration` schema — see Roadmap.

## Current Status & Roadmap

What's working:
- [x] Register / Login / Logout with JWT cookie auth
- [x] Role-based middleware (`protect`, `isAdmin`)
- [x] Public home page + browse sports (read-only)
- [x] Student dashboard with registration summary
- [x] Admin dashboard stats + registrations view with status filter

What's **not** implemented yet (present in the original assignment spec, not yet in this codebase):
- [ ] Add `bcryptjs` to `package.json` dependencies (currently used but undeclared)
- [ ] Student: actually **register for a sport** (no POST route exists yet — `Registration` documents can't currently be created through the API)
- [ ] Student: payment submission flow (JazzCash QR + transaction ID)
- [ ] Student: cancel a pending registration
- [ ] Admin: add / edit / delete / toggle-active sport (CRUD is currently read-only)
- [ ] Admin: approve/reject a payment status
- [ ] Unique index on `(user_id, sport_id)` to prevent duplicate registrations
- [ ] Consistent API prefixing (student/admin routes not under `/api/`)
- [ ] CORS middleware (needed once a separate frontend origin calls this API)
- [ ] A seed script for sample sports + an admin account

## Contributing / Continuing This Project

If you're picking this up to keep building: the biggest gap is that **students can browse but can't actually register or pay**, and **admins can view but not manage** sports or payments. That's the natural next milestone.

---

**Author:** HAQ516
