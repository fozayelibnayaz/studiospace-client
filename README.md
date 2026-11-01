# StudioSpace — Client (Next.js App Router)

Frontend for **StudioSpace**, a peer-to-peer creative workspace and production studio sharing platform. Photography, film, podcast, music and art professionals discover studio spaces, reserve exact hours and manage bookings; owners list and manage their rooms.

**Live site:** https://studiospace-client-ebon.vercel.app · **API:** https://studiospace-server-xi.vercel.app · **Server repo:** https://github.com/fozayelibnayaz/studiospace-server (shared database: `studiospaceDB` on MongoDB Atlas)

## ✨ Features (Assignment-8: CRUD + Authentication)

- **Email/password + Google authentication with BetterAuth** (MongoDB adapter) and a custom JWT flow: every successful login/register also calls `POST /jwt` so the Express API sets an **httpOnly `token` cookie** (Challenge 1). Logout clears both.
- **Role-safe CRUD on studios** — create, read (search / filter / sort / limit), update and delete with server-side owner checks; the UI enforces it with private routes and read-only host identity fields.
- **Booking system with double-booking prevention** (Challenge 2): the booking modal computes live hours + cost, and the server rejects overlapping pending/confirmed slots with a human-readable 409 toast.
- **My Bookings** with colour-coded status badges (Pending / Confirmed / Completed / Cancelled), one-click cancel modal for pending sessions and **PDF invoice download** (jsPDF) for confirmed bookings.
- **Host Booking Requests** — the other half of the lifecycle: whoever owns the studio sees every incoming reservation and moves it `Pending → Confirmed → Completed`. Customers can only cancel while a booking is still pending; the server enforces both rules and rejects invalid jumps with a 409.
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
| Creator / customer account | `examiner@studiospace.dev` |
| Password | `Examiner123` |
| Host account (owns all 12 seeded studios) | `seed@example.com` |
| Host password | `Seedpass1` |
| Google | "Continue with Google" works once `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are set; the examiner's Google account can sign in the same way |

**How to try the booking lifecycle:** sign in as the creator, book any studio from its details page (it lands as **Pending** in *My Bookings*), then sign in as the host, open **Booking Requests** from the avatar menu, and press **Confirm Booking**, then **Mark Completed**. Sign back in as the creator to see the badge change and unlock the PDF invoice.

## 🗺️ Routes

`/` home (hero slider, featured, categories, how-it-works, guarantee) · `/studios` explore (search/category/sort) · `/studios/[id]` details + booking modal · `/add-studio`* · `/my-listings`* · `/studios/edit/[id]`* · `/my-bookings`* (cancel + PDF invoice) · `/booking-requests`* (host confirms/completes) · `/wishlist`* · `/dashboard`* · `/login` · `/register` · `/how-it-works` · `/about` · custom 404.

*Private routes are guarded by **`src/proxy.js`** (Next.js 16 renamed middleware → proxy) using the BetterAuth session cookie, plus a client-side session gate that shows a skeleton while loading — reloading a private page while signed in never bounces you to login, and the intended destination is preserved via `?redirect=`.

## ☁️ Deployment (Vercel)

1. Deploy the API first (Vercel, `api/index.js` + `vercel.json` in the server repo) and copy its public URL.
2. Vercel → **New Project** → import this repo (framework auto-detected as Next.js).
3. Add the environment variables from `.env.local`, with production values:
   - `NEXT_PUBLIC_SERVER_URL` → the deployed API origin (no trailing slash)
   - `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` → the Vercel production URL
   - `MONGODB_URI` → Atlas connection string (the same `studiospaceDB`)
   - `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_IMGBB_API_KEY`
4. In Google Cloud Console add the production redirect URI: `https://studiospace-client-ebon.vercel.app/api/auth/callback/google`.
5. Set the API's `CLIENT_URL` to the Vercel origin so credentialed CORS and the `Secure; SameSite=None` JWT cookie work, then redeploy the API.
6. `NEXT_PUBLIC_*` values are inlined at build time — redeploy the client after changing them.

Current production deployment: client `https://studiospace-client-ebon.vercel.app` → API `https://studiospace-server-xi.vercel.app`.

**If data fails to load in production:** open `https://studiospace-server-xi.vercel.app/health` — `"database": "configured"` means the API can see `MONGODB_URI`. If it says `"missing"` (or the API returns `ECONNREFUSED 127.0.0.1:27017`), the variable is empty or the deployment predates it — set it and redeploy. Also confirm the Atlas IP access list allows `0.0.0.0/0` so Vercel's serverless IPs can connect.
