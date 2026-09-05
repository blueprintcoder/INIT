# Prerequisites, Environment Setup & Quickstart Guide
> Follow this guide to set up your machines and verify everything in under 5 minutes.

---

## 1. System Prerequisites

Before starting, verify you have the required runtimes installed:

| Prerequisite | Minimum Version | How to check in terminal | Download Link (if missing) |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0+` | `node -v` | [nodejs.org](https://nodejs.org/) (LTS recommended) |
| **npm** | `v9.0.0+` | `npm -v` | Bundled with Node.js |
| **Git** | Any recent | `git --version` | [git-scm.com](https://git-scm.com/) |
| **MongoDB** | Local or Atlas | Optional | App includes `mockFallback.js` if MongoDB is offline! |

---

## 2. Parallel Launch (Minute 1 to Minute 5)

Because of our decoupled architecture, everyone runs their own section independently:

### 🟢 For Aniket (Frontend)
1. Open a terminal in `INIT/client/`.
2. Run:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
4. You will immediately see the Dark Mode cockpit with live charts using `mockData.js`.

### 🔵 For Yash (Backend Math & Models)
1. Open a terminal in `INIT/server/`.
2. Test the mathematical engine immediately (no server or database needed!):
   ```bash
   node src/engine/testEngine.js
   ```
3. You will see colored terminal output calculating the $10M portfolio's Sharpe ratio, 1-Day VaR, and a simulated flash crash!

### 🟣 For Jeet (Lead & API Server)
1. Open a terminal in `INIT/server/`.
2. Run:
   ```bash
   npm install
   npm run dev
   ```
3. Your server will launch on `http://localhost:5000`.
4. Test the health endpoint in your browser:
   `http://localhost:5000/api/health`
5. Test the portfolio endpoint:
   `http://localhost:5000/api/portfolio`

---

## 3. The 15-Minute Hour-5 Integration Checklist

When Yash finishes the math and Aniket polishes the UI, connect them:

- [ ] **Step 1:** Jeet imports Yash's functions in `server/src/routes/simulateRoutes.js`:
  ```javascript
  const { simulateFlashCrash } = require('../engine/marketSimulator');
  const { calculateVaR, evaluateCircuitBreakers } = require('../engine/riskEngine');
  ```
- [ ] **Step 2:** Aniket connects React to Jeet's API in `client/src/App.jsx`:
  Replace the static `initialPortfolio` state with a `useEffect` fetch to `http://localhost:5000/api/portfolio`.
- [ ] **Step 3 (Live Demo Check):** Click the `[⚡ Simulate Flash Crash (-12%)]` button on Aniket's screen.
  - Verify that the banner turns RED.
  - Verify that 1-Day VaR spikes past 4.0% to 6.2%.
  - Verify that the system de-risks $1,000,000 to Cash/T-Bills.
