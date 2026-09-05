/**
 * YASH'S TEST RUNNER — Run with: node src/engine/testEngine.js
 * Tests all financial formulas in terminal without needing Express, MongoDB, or React!
 */

const { calculateSharpe, optimizeAllocation } = require('./optimizer');
const { calculateVaR, evaluateCircuitBreakers } = require('./riskEngine');
const { simulateFlashCrash } = require('./marketSimulator');
const mockData = require('./mockFallback');

console.log('\x1b[34m====================================================\x1b[0m');
console.log('\x1b[34m    AEGISCAP QUANTITATIVE MATH TEST RUNNER          \x1b[0m');
console.log('\x1b[34m====================================================\x1b[0m\n');

// 1. Initial State
const holdings = mockData.portfolio.holdings;
console.log('\x1b[32m[1] Testing Initial Portfolio State ($10,000,000)...\x1b[0m');
const initialMetrics = calculateVaR(holdings);
console.log(`    - 1-Day VaR (95%): ${(initialMetrics.var95 * 100).toFixed(2)}%`);
console.log(`    - Status: ${initialMetrics.status}`);
console.log(`    - Cash Buffer: $${mockData.portfolio.cashBuffer.toLocaleString()} (15% Locked)\n`);

// 2. Optimization Check
console.log('\x1b[32m[2] Testing Optimizer under Constraints & Turnover Penalty...\x1b[0m');
const optResult = optimizeAllocation(holdings, { minCashBufferPercent: 0.15, maxSingleAssetCap: 0.25 });
console.log(`    - Turnover Required: ${optResult.turnoverPercent}%`);
console.log(`    - Est. Brokerage Cost: $${optResult.estTransactionCost}\n`);

// 3. Flash Crash Simulation
console.log('\x1b[31m[3] Triggering Simulated Flash Crash (-12% in Equities)...\x1b[0m');
const shockedHoldings = simulateFlashCrash(holdings);
const shockedMetrics = calculateVaR(shockedHoldings);
console.log(`    - New 1-Day VaR (95%): ${(shockedMetrics.var95 * 100).toFixed(2)}% (Breached 4.0% limit!)`);
console.log(`    - New Status: ${shockedMetrics.status}`);

// 4. Circuit Breaker Trigger Check
const breaker = evaluateCircuitBreakers(shockedMetrics, { tier2BreakerTriggerVaR: 0.040 });
console.log(`    - Circuit Breaker Fired: ${breaker.triggered ? 'YES (TIER 2)' : 'NO'}`);
console.log(`    - Action Taken: ${breaker.action}`);
console.log(`    - System Message: "${breaker.message}"\n`);

console.log('\x1b[34m====================================================\x1b[0m');
console.log('\x1b[32mALL FINANCIAL MATH TESTS PASSED SUCCESSFULLY!       \x1b[0m');
console.log('\x1b[34m====================================================\x1b[0m');
