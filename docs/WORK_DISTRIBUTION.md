# Team Work Distribution & Zero-Clash Architecture (24-Hour Sprint)
> **Stack:** 100% MERN + GenAI (No external runtimes)  
> **Team:** Jeet (Lead & GenAI), Yash (Backend Math & MongoDB), Aniket (Frontend & UI Cockpit)  
> **Rule:** Every developer owns an isolated directory. Do not edit other members' files. Follow the shared JSON contract.

---

## 👥 Roles & Responsibilities at a Glance

```
                                 [JEET - Team Lead]
                        Orchestration, Express APIs, Socket.io,
                            GenAI Audit Memos & Scenarios
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
       [ANIKET - Frontend Lead]                        [YASH - Backend & Math Lead]
    React Dashboard, Tailwind,                     MongoDB Schemas, Seed Data,
   Recharts, What-If Simulator,                    Sharpe Ratio, VaR/CVaR Math,
    Circuit Breaker Cockpit                        Market Flash Crash Simulator
     (Folder: /client)                                (Folder: /server/src/engine)
```

---

### 1. Aniket (Frontend & Cockpit UX Lead) — Folder: `/client`
- **Branch:** `feature/frontend-ui`
- **Responsibilities:**
  - Setup React + Vite + Tailwind CSS + Lucide Icons + Recharts.
  - Use `src/mock/mockData.js` to build components without waiting for the backend:
    1. **ExecutiveMetrics.jsx:** Total Capital ($10M), P&L, Sharpe Ratio gauge, VaR gauge, Liquidity buffer status.
    2. **AllocationChart.jsx:** Bar/Donut chart comparing Current vs. Target vs. Suggested weights.
    3. **CircuitBreakerPanel.jsx:** Glowing risk status banner, Mode Toggle (Advisory vs. Breaker), and the `[⚡ Trigger Flash Crash]` demo button.
    4. **WhatIfSimulator.jsx:** Interactive chat box for crisis queries and sliders for manual rate/equity shocks.
    5. **AuditFeed.jsx:** Real-time log showing AI Risk Officer memos.

---

### 2. Yash (Backend Math, Data Models & Simulation Lead) — Folder: `/server/src/engine` & `/server/src/models`
- **Branch:** `feature/math-and-models`
- **Responsibilities:**
  - Create Mongoose schemas in `/server/src/models`:
    - `Portfolio.js`: Assets, quantities, target weights, cash balance.
    - `RiskPolicy.js`: Constraints (min cash, max stock cap, max VaR).
    - `AuditLog.js`: Timestamped record of triggers, trades, fees, and AI memos.
    - `seed.js`: Script to seed a realistic $10M corporate portfolio across SPY, QQQ, IEF, LQD, GLD, USD.
  - Write pure math modules in `/server/src/engine`:
    - `optimizer.js`: Sharpe ratio maximization and turnover cost penalty math.
    - `riskEngine.js`: 1-Day VaR (95%), CVaR, and Circuit Breaker condition evaluator.
    - `marketSimulator.js`: Functions to generate price shocks (e.g., `simulateFlashCrash()`, `simulateRateHike()`).
  - **Contract:** Export pure functions: `calculateVaR()`, `optimizeAllocation()`, `simulateShock()`.

---

### 3. Jeet (Team Leader - Orchestration & GenAI Lead) — Folder: `/server/src/routes`, `/server/src/services`, `/server/src/sockets`
- **Branch:** `feature/orchestrator-genai`
- **Responsibilities:**
  - Setup Express server, middleware, CORS, and environment variables.
  - Implement API routes connecting Yash's engine:
    - `GET /api/portfolio` (Returns current portfolio and metrics).
    - `POST /api/rebalance/execute` (Executes/approves recommended allocation).
    - `POST /api/policy/update` (Updates risk constraints).
    - `POST /api/simulate/shock` (Triggers market crash or shock scenario).
  - Implement GenAI Services (`/server/src/services/genai.js`):
    - Policy Parser: Natural language text -> JSON constraints.
    - Trade Audit Memo: Mathematical delta -> Executive narrative.
    - What-If Query Parser: Natural language crisis -> Numeric shock vector.
  - Socket.io Setup (`/server/src/sockets/socket.js`):
    - Real-time broadcasts (`portfolio-updated`, `circuit-breaker-alert`).
  - Final integration with Aniket's frontend.
