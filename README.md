# 🚀 GigFlow Backend Setup Script

### This script clones the repo, installs dependencies, and provides commands for development and production.

## 1️⃣ Clone the repository

```bash
git clone https://github.com/gritik418/GigFlow-Backend.git
```

```bash
cd GigFlow-Backend
```

## 2️⃣ Install dependencies

```bash
npm install
```

## 3️⃣ Start development server (hot reload)

```bash
npm run dev
```

## 4️⃣ Build for production

```bash
npm run build
```

## 5️⃣ Start production server

```bash
npm run start
```

## 📌 Stack & Tools

- Framework: **Express.js + TypeScript**
- Database: **MongoDB + Mongoose**
- Real-time: **Socket.IO**
- Auth: **JWT + HttpOnly Cookies**
- ORM: **Mongoose Transactions**

## ✅ Features Overview

- **User Auth**: JWT + HttpOnly cookies
- **Gig CRUD**: Full MongoDB operations
- **Bidding**: Price + message bids
- **Hiring Flow**: Atomic hire → Auto-reject others
- **Owner Bids**: Client sees own gig bids only
- **Socket.IO**: Live real-time bid/hire updates
- **Transactions**: Race-condition safe hiring
- **CORS**: Frontend integration ready
- **Validation**: Zod schemas

## 🔌 Environment Setup

Create `.env` file:

```bash
cp .env.example .env
```

## 📡 API Endpoints

```
POST  /api/auth/register    # User signup
POST  /api/auth/login       # Login + JWT cookie
POST  /api/auth/logout      # Clear cookie
GET   /api/gigs             # Browse open gigs
POST  /api/gigs             # Create gig
POST  /api/bids             # Place bid
GET   /api/bids/:gigId      # Owner's bids
PATCH /api/bids/:bidId/hire # Hire freelancer (Atomic)
```

---

```bash
echo "✅ Backend setup complete! Run 'npm run dev' to start API server."
```
