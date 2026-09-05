# Yash's Quickstart Guide (Backend Math & Data Lead)
> **Your Workspace:** `server/src/engine/` and `server/src/models/` only  
> **Command to test:** `node src/engine/testEngine.js`

---

## 🎯 Your Mission in Phase 1
Write the mathematical algorithms and data models for our $10M corporate treasury. You write pure JavaScript functions and test them directly in terminal!

---

## 🚀 Step-by-Step Instructions:

### Step 1: Run Your Test Runner
```bash
cd "D:\SniPify\Developer - Jeet\INIT\server"
node src/engine/testEngine.js
```
*You will immediately see your formulas execute and print out formatted calculations!*

### Step 2: Files You Own & What to Build
1. **`src/engine/optimizer.js`:**
   - `calculateSharpe(weights, returns, covMatrix)`: Computes expected return and Sharpe ratio.
   - `optimizeAllocation(holdings, policy)`: Enforces that Cash holding >= 15% and stocks <= 25%.
2. **`src/engine/riskEngine.js`:**
   - `calculateVaR(holdings)`: Calculates 1-Day Parametric VaR (95% confidence).
   - `evaluateCircuitBreakers(metrics, policy)`: If VaR > 4.0%, trips the Tier-2 Circuit Breaker.
3. **`src/engine/marketSimulator.js`:**
   - `simulateFlashCrash(holdings)`: Drops QQQ by 14%, SPY by 10%, raises Treasuries by 2%, and keeps Cash 1.0.
4. **`src/models/Portfolio.js` & `seed.js`:**
   - Mongoose schemas for the $10M balance sheet.

---

## 💡 Deliverable to Jeet at Hour 5
Once your functions in `optimizer.js`, `riskEngine.js`, and `marketSimulator.js` pass `node src/engine/testEngine.js`, tell Jeet: *"My math is ready to import!"*
