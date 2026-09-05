# Aniket's Quickstart Guide (Frontend & Cockpit UX)
> **Your Workspace:** `client/` folder only  
> **Command to start:** `npm run dev` (Runs at `http://localhost:5173`)

---

## 🎯 Your Mission in Phase 1
Build the visual executive dashboard for the hackathon presentation. You have `src/mock/mockData.js` ready so you never wait for the backend!

---

## 🚀 Step-by-Step Instructions:

### Step 1: Start the Frontend
```bash
cd "D:\SniPify\Developer - Jeet\INIT\client"
npm install
npm run dev
```

### Step 2: Components You Own
1. **`src/components/ExecutiveMetrics.jsx`:**
   - 4 Cards: Total Capital ($10M), Sharpe Ratio (1.85), 1-Day VaR (2.40%), Cash Buffer ($1.5M).
   - Style condition: If `metrics.status === 'CRITICAL'`, turn the VaR card border and text RED.
2. **`src/components/AllocationChart.jsx`:**
   - Uses Recharts to render double bars: Blue (Current %) vs. Green (Target %) across SPY, QQQ, IEF, LQD, USD.
3. **`src/components/CircuitBreakerPanel.jsx`:**
   - Safety banner: Green when healthy, pulsing RED when `triggered === true`.
   - Toggle button: `[Mode: Advisory]` vs `[Mode: Autonomous]`.
   - The Demo Button: `[⚡ Simulate Flash Crash (-12%)]`.
4. **`src/components/WhatIfSimulator.jsx`:**
   - Chat input for crisis testing + dynamic result box.

---

## 💡 How to Test Locally
Open the browser at `http://localhost:5173`. Click the red **`[⚡ Simulate Flash Crash]`** button. The dashboard will update locally to show the red alarm and de-risking numbers!
