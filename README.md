# Gifto — Premium Gift Delivery Platform (PERN Stack)

**Gifto** is a production-ready, fully responsive gift delivery e-commerce platform designed for Pakistan and international buyers (USA, UK, Canada, UAE, etc.) sending gifts to major Pakistani cities (Lahore, Karachi, Islamabad, Faisalabad, Rawalpindi, Multan, and more).

Built with the **PERN stack** (PostgreSQL, Express.js, React.js, Node.js), Tailwind CSS, Framer Motion, Prisma ORM, Zustand, and Recharts.

---

## 🚀 Technology Stack

- **Frontend (`/client`):**
  - React.js (Vite) + React Router v6
  - State Management: Zustand (`useAuthStore`, `useCartStore`, `useWishlistStore`)
  - Data Fetching: TanStack Query (@tanstack/react-query) + Axios
  - Styling: Tailwind CSS (Custom Deep Teal `#0F766E`, Coral `#FF6B6B`, Amber Gold `#F59E0B`)
  - Icons & UI: Lucide React icons, Framer Motion animations, React Hot Toast
  - Charts: Recharts for Admin Sales & Revenue Analytics

- **Backend (`/server`):**
  - Node.js + Express.js REST API Architecture
  - Database: PostgreSQL (Neon Cloud DB) with Prisma ORM
  - Authentication: JWT (Access & Refresh tokens) + bcryptjs password hashing
  - Security & Utilities: Helmet, CORS, Express Rate Limit, Multer + Cloudinary image uploads

---

## 🛠️ Project Structure

```
Gifto/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma       # Normalized PostgreSQL schema
│   │   └── seed.js             # Seeding categories, products, delivery zones, admin user
│   ├── src/
│   │   ├── config/             # DB & Cloudinary configs
│   │   ├── controllers/        # Express controllers (auth, product, category, order, etc.)
│   │   ├── middlewares/        # JWT auth, RBAC roleCheck, errorHandler, validate
│   │   ├── routes/             # REST endpoints under /api
│   │   └── server.js           # Server entry point
│   ├── package.json
│   └── .env
└── client/
    ├── src/
    │   ├── api/                # Axios instance & endpoints
    │   ├── components/         # Header, Footer, ProductCard, AdminLayout, etc.
    │   ├── store/              # Zustand state stores
    │   ├── pages/
    │   │   ├── public/         # Home, Shop, Category, ProductDetail, Cart, Checkout, Tracking
    │   │   ├── account/        # Customer Dashboard, Orders, Wishlist, Addresses, Profile
    │   │   └── admin/          # Admin Dashboard, Products, Orders + Invoice, Reports, Settings
    │   ├── router.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json
```

---

## 🔐 Credentials & Environment Setup

### 1. Database Connection String
The PostgreSQL connection is configured in `server/.env`:
```env
DATABASE_URL="postgresql://neondb_owner:npg_TBJ0OHa3whnp@ep-holy-feather-av32dywc-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 2. Pre-Seeded Test Accounts

- **Super Admin Account:**
  - **Email:** `admin@gifto.pk`
  - **Password:** `admin123`
  - **Role:** `SUPER_ADMIN`
  - **Access:** Full Admin Portal (`/admin/dashboard`), Product CRUD, Order Status Updates & Invoice Printing, Recharts Analytics, Site Settings.

- **Customer Test Account:**
  - **Email:** `ayesha@example.com`
  - **Password:** `user123`
  - **Points:** 120 Loyalty Points

---

## 🚦 How to Run Locally

### Backend Server (`/server`):
```bash
cd server
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
Backend runs on `http://localhost:5000`.

### Frontend Client (`/client`):
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:3000` (proxies `/api` to port 5000).

---

## ✨ Key Features & User Flows

1. **City Deliverability Check:** Interactive delivery city selector (Lahore, Karachi, Islamabad, etc.) validating product deliverability in real-time.
2. **Social Proof & Urgency:** Live pseudo-realtime counter ("X people viewing this product right now").
3. **Loyalty Points System:** Earn 5% points on purchases displayable on customer account dashboard.
4. **Order Tracking & Timeline:** Order tracking lookup (`Pending` → `Confirmed` → `Out for Delivery` → `Delivered`).
5. **Printable Invoice:** Admin order detail page features printable customer receipt & packaging slip.
6. **Full Admin Panel:** Recharts sales charts, product stock alerts, coupon creation, review moderation, and business profile settings (FBR NTN & Bank Details).
