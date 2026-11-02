# Jagadhatri Darshan — Krishnanagar Pandal Hopping Guide

> **“Discover Krishnanagar, One Pandal at a Time.”**  
> *A production-quality, mobile-first web guide for Jagadhatri Puja in Krishnanagar, Nadia, West Bengal, India.*

---

## 🌟 Key Features

1. **Bilingual Bengali & English Experience**:
   - Instant language switching across all navigation, cards, filter states, and validation messages.
   - Preserves official Bengali names (`বাংলা`) and editorial heritage descriptions alongside English.
2. **Direct Google Maps Navigation (Core Functional Requirement)**:
   - Direct `Navigate with Google Maps` link on every verified pandal card, detail view, map marker popup, and food/essentials listing.
   - Generates standards-compliant directions URLs (`https://www.google.com/maps/dir/?api=1&destination=LAT%2CLNG`).
   - Browser geolocation origin detection (with graceful fallback if permission is denied).
   - Mode switching (walking, driving / toto).
   - Strict safety enforcement: Unverified coordinates automatically disable the navigation button with clear explanations.
3. **Full Interactive Krishnanagar Map**:
   - Leaflet + OpenStreetMap with attribution.
   - Custom maroon and gold Bengali festival pin markers.
   - Synchronized sidebar and mobile drawer list.
   - User location pulse indicator with permission and error handling.
   - Locality & category quick filters.
4. **Multi-Stop Hopping Route Planner**:
   - Select multiple pandals, reorder stops with accessible move-up / move-down controls.
   - Automatic chunking into safe segments if stops exceed Google Maps waypoint limits (<= 10 stops per link).
   - Shareable routes via URL query parameters (`/route-planner?stops=...`).
   - Local persistence for anonymous users and Supabase persistence for authenticated accounts.
5. **Food, GI Sweets & Visitor Essentials**:
   - Dedicated directory for GI-tagged Krishnanagar sweets (Sarpuria & Sarbhaja by legendary confectionery Adhar Chandra Das & Sons), official festival parking grounds, municipal water booths, and district sadar hospital first-aid points.
6. **Secure Admin Dashboard (`/admin`)**:
   - Protected console with statistics for pandals, localities, amenities, and community submissions.
   - Interactive map coordinate picker for precision latitude & longitude placement.
   - Toggle publish/unpublish, mark verified with timestamp, review and approve community corrections.
7. **Production-Ready & Fully Tested**:
   - Automated unit test suite with 20 passing unit tests for URL generation, coordinate validation, segment chunking, and data store filtering.
   - Tested Next.js production build (`npm run build`) with static prerendering across all routes.

---

## 🛠 Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling**: Tailwind CSS with custom Bengali cultural palette (Deep Maroon, Warm Ivory, Muted Gold, Charcoal)
- **Maps**: Leaflet & React Leaflet with OpenStreetMap tiles
- **Database & Auth**: Supabase PostgreSQL + Row Level Security (RLS) migrations
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod
- **Testing**: Vitest (`npm run test`)

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js v20+ or v22+
- npm v10+

### 2. Installation
```bash
# Clone or enter project directory
cd "Jagadharti Pujo"

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
npm run test
```
Runs 20 unit tests covering Google Maps URL patterns, Krishnanagar vicinity boundaries, waypoint splitting, and search filters.

### 5. Build for Production
```bash
npm run build
```

---

## 🔐 Administrator Setup & Security

1. **Accessing the Portal**:  
   Navigate directly to **`/admin`** (admin links are hidden from public visitors).
2. **Configuring Credentials**:
   Credentials are kept strictly server-side in `.env` (never exposed to browser clients or public code):
   - `ADMIN_EMAIL` (e.g. `admin@jagadhatridarshan.in`)
   - `ADMIN_PASSWORD` (e.g. `krishnanagar2026`)
   - `ADMIN_SESSION_SECRET` (secure random signing string)
3. **Connecting Remote Supabase**:
   - Run the SQL migration in `supabase/migrations/20261029000001_create_jagadhatri_schema.sql` inside your Supabase project's SQL Editor.
   - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env`.
   - Admin sessions use secure HTTP-only cookies and sanitized server-side error handling.

---

## 🗺 Direct Google Maps Navigation Manual Test Checklist

| Scenario | Expected Behavior | Status |
|---|---|---|
| Click "Navigate with Google Maps" on Chasapara Buri Maa | Opens `https://www.google.com/maps/dir/?api=1&destination=23.4072%2C88.5028` in new tab | Verified |
| Click navigation when geolocation permission is granted | Destination is set and user's current GPS lat/lng is passed as `origin` | Verified |
| Click navigation when geolocation is denied | URL is generated with destination only; Google Maps external app prompts for start point | Verified |
| Click navigation on unverified candidate pandal | Button is disabled with amber warning; tooltip explains destination is awaiting verification | Verified |
| Route with 4 stops in Route Planner | Multi-stop URL generated with origin, destination, and intermediate `waypoints` joined by `\|` | Verified |
| Route with 15 stops in Route Planner | Segment notice displayed; split into Segment 1 (Stops 1-9) and Segment 2 (Stops 9-15) avoiding URL limits | Verified |

---

## 📦 Supabase Database & Migrations

The database migration is located at:
`supabase/migrations/20261029000001_create_jagadhatri_schema.sql`

It creates:
- `pandals`: Pandal listings, bilingual names, categories, coordinates, and verification dates.
- `localities`: Krishnanagar wards/neighborhoods (Chasapara, Rajbari, Golapatti, etc.).
- `places`: Food, sweets (Sarpuria & Sarbhaja), parking zones, drinking water, restrooms, first aid.
- `announcements`: Traffic police road advisories, immersion schedules.
- `profiles`: User preferences and admin roles.
- `saved_pandals`: Visitor favorites.
- `saved_routes` & `route_stops`: Multi-stop hopping routes.
- `submissions`: Community corrections and timing update reports.
- Comprehensive **Row Level Security (RLS)** policies ensuring public read of published records and admin-only write operations.

---

## 🌐 External Services & Configuration Required for Production

Before deploying to Vercel or Netlify:
1. **Supabase Project**:
   - Create a free project at [supabase.com](https://supabase.com).
   - Run `supabase/migrations/20261029000001_create_jagadhatri_schema.sql`.
   - Copy `Project URL` and `anon public key` into Netlify/Vercel environment variables.
2. **OpenStreetMap Tile Usage Policy**:
   - The default tile provider uses `https://tile.openstreetmap.org`. For high-volume production traffic (>50k daily active users), consider configuring an OSM-compatible commercial tile CDN (such as Stadia Maps, Jawg, or MapTiler).
3. **Domain & HTTPS**:
   - Must be served over HTTPS so browser Geolocation API (`navigator.geolocation`) operates reliably on mobile devices.

---

## 📄 License & Attribution
- All cultural festival traditions and heritage rights of Nadia, West Bengal are respectfully acknowledged.
- Map data &copy; [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
