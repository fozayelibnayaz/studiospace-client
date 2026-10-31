# StudioSpace — Client (Next.js App Router)

Frontend for **StudioSpace**, a peer-to-peer creative workspace and production studio sharing platform. Photography, film, podcast, music and art professionals discover studio spaces, reserve exact hours and manage bookings; owners list and manage their rooms.

**Live site:** <placeholder-live-url> · **Server repo:** `../studiospace-server` (shared database: `studiospaceDB`)

## ✨ Features (Assignment-8: CRUD + Authentication)

- **Email/password + Google authentication with BetterAuth** (MongoDB adapter) and a custom JWT flow: every successful login/register also calls `POST /jwt` so the Express API sets an **httpOnly `token` cookie** (Challenge 1). Logout clears both.
- **Role-safe CRUD on studios** — create, read (search / filter / sort / limit), update and delete with server-side owner checks; the UI enforces it with private routes and read-only host identity fields.
- **Booking system with double-booking prevention** (Challenge 2): the booking modal computes live hours + cost, and the server rejects overlapping pending/confirmed slots with a human-readable 409 toast.
- **My Bookings** with colour-coded status badges (Pending / Confirmed / Completed / Cancelled), one-click cancel modal for pending sessions and **PDF invoice download** (jsPDF) for confirmed bookings.
- **Wishlist** — heart any studio card from Explore or Details; saved items persist in MongoDB and toggle off again from the wishlist page.
- **Theme customization** (Challenge 3): light and custom "studio dark" theme, toggled in the navbar, persisted in localStorage, applied before first paint (no flash on reload).
- Host dashboard with live stats, custom 404, branded loading skeletons and empty states everywhere, fully responsive layouts with equal-height 4/3 cards.

## 🧰 Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.4.3 (App Router, JavaScript) + React 19 |
| Styling | Tailwind CSS v4 + DaisyUI v5 (custom `studio` dark theme) |
| Fonts | Space Grotesk (headings), Inter (body) — next/font |
| Auth | BetterAuth 1.7 (email/password + Google, MongoDB adapter) |
| API | Express 5 + MongoDB native driver (separate repo) |
| Slider | Swiper 14 (autoplay + pagination) |
| Toasts | react-hot-toast (zero `window.alert` anywhere) |
| Icons | lucide-react (+ inline X-logo SVG) |
| PDF | jsPDF |
| Images | imgbb upload API + remote URL input |

## 🚀 Local setup

```bash
# 1. Start the API server (see ../studiospace-server README)
cd ../studiospace-server && npm install && npm run seed && npm start   # :5001

# 2. Start this app
cd studiospace-client
npm install
cp .env.example .env.local      # fill values (see below)
npm run dev                     # http://localhost:3000
```

`npm run build && npm start` for the production bundle (must build cleanly — it does).

## 🔐 Environment (`.env.example` → `.env.local`)

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_SERVER_URL` | Express API base URL, e.g. `http://localhost:5001` |
| `BETTER_AUTH_SECRET` | Secret for BetterAuth session cookies |
| `BETTER_AUTH_URL` / `NEXT_PUBLIC_BETTER_AUTH_URL` | Canonical client URL |
| `MONGODB_URI` | Same DB as the server (`studiospaceDB`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `NEXT_PUBLIC_IMGBB_API_KEY` | imgbb key for upload-image field |

> The public `NEXT_PUBLIC_*` values get inlined at build time — restart `next dev` after changes.

## 🧪 Examiner Test Credentials

| Field | Value |
|---|---|
| Email (email/password login) | `[add-your-test-email@example.com]` |
| Password | `[add-your-test-password]` |
| Google | Sign up with any Google account once OAuth keys are configured |
| Seeded demo studios' owner | register with `seed@example.com` / any allowed password matching the rules to administer the 12 seeded listings |

## 🗺️ Routes

`/` home (hero slider, featured, categories, how-it-works, guarantee) · `/studios` explore (search/category/sort) · `/studios/[id]` details + booking modal · `/add-studio`* · `/my-listings`* · `/studios/edit/[id]`* · `/my-bookings`* (cancel + PDF invoice) · `/wishlist`* · `/dashboard`* · `/login` · `/register` · `/how-it-works` · `/about` · custom 404.

*Private routes are guarded by **`src/proxy.js`** (Next.js 16 renamed middleware → proxy) using the BetterAuth session cookie, plus a client-side session gate that shows a skeleton while loading — reloading a private page while signed in never bounces you to login, and the intended destination is preserved via `?redirect=`.
