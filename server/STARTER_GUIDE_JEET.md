# Jeet's Quickstart Guide (Lead, API & Orchestration)
> **Your Workspace:** `server/src/routes/`, `server/src/sockets/`, and `server.js`  
> **Command to start:** `npm run dev` (Runs at `http://localhost:5000`)

---

## 🎯 Your Mission in Phase 1
Set up the Express API server, mount the endpoints, and connect Yash's math to Aniket's React frontend.

---

## 🚀 Step-by-Step Instructions:

### Step 1: Start the API Server
```bash
cd "D:\SniPify\Developer - Jeet\INIT\server"
npm install
npm run dev
```
*Your server is running at `http://localhost:5000`.*

### Step 2: Endpoints to Verify in Browser/Postman
1. `GET http://localhost:5000/api/health` -> Returns `{ status: "UP" }`.
2. `GET http://localhost:5000/api/portfolio` -> Returns current $10M portfolio JSON.
3. `POST http://localhost:5000/api/simulate/flash-crash` -> Returns shocked holdings, spiked VaR (6.2%), and triggers the circuit breaker.

### Step 3: Real-Time Sockets (`src/sockets/socket.js`)
- Emits `market-shock` event when flash crash is triggered so Aniket's frontend turns RED live without page reload.

### Step 4: Hour 5 Integration
- Replace imports in `src/routes/simulateRoutes.js` with Yash's finished math functions.
- Tell Aniket to point his React `fetch` to `http://localhost:5000/api/portfolio`.
