# AegisCap — Master Starter Pack (24-Hour Hackathon)
> **Track:** FinTech – Asset & Capital Management / Optimization Controls  
> **Stack:** 100% MERN (MongoDB, Express, React, Node.js)  
> **Team:** Jeet (Lead & API), Yash (Math & Data), Aniket (Frontend & UI Cockpit)

---

## ⚡ Quickstart in 30 Seconds

### Prerequisites:
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **Web Browser**: Chrome, Edge, or Brave

### How to Run in Parallel (Minute 1):
Open 3 separate terminals:

```bash
# Terminal 1: ANIKET (Frontend UI)
cd "D:\SniPify\Developer - Jeet\INIT\client"
npm install
npm run dev
# Running at: http://localhost:5173
```

```bash
# Terminal 2: YASH (Math Engine Test Runner)
cd "D:\SniPify\Developer - Jeet\INIT\server"
node src/engine/testEngine.js
# Runs all financial math tests in terminal instantly!
```

```bash
# Terminal 3: JEET (Express API Server)
cd "D:\SniPify\Developer - Jeet\INIT\server"
npm install
npm run dev
# Running at: http://localhost:5000
```

---

## 📁 Project Directory Guide
- **`docs/`**: Master documentation, glossary, API contracts, and team distribution.
- **`client/`**: React + Tailwind + Recharts frontend (Owned by **Aniket**).
- **`server/src/engine/` & `models/`**: Quantitative financial math & database schemas (Owned by **Yash**).
- **`server/src/routes/` & `sockets/`**: Express REST API & WebSockets (Owned by **Jeet**).
