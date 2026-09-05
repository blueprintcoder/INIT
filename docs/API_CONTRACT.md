# API & Shared Data Contract
All team members must conform to this schema.

---

## 1. Core Portfolio Object (Shared JSON)
```json
{
  "totalValue": 10000000,
  "cashBuffer": 1500000,
  "metrics": {
    "sharpeRatio": 1.85,
    "var95": 0.024,
    "cvar95": 0.038,
    "status": "HEALTHY",
    "activeMode": "ADVISORY"
  },
  "holdings": [
    { "symbol": "SPY", "name": "S&P 500 ETF", "weight": 0.25, "value": 2500000, "targetWeight": 0.25 },
    { "symbol": "QQQ", "name": "Tech Growth", "weight": 0.20, "value": 2000000, "targetWeight": 0.20 },
    { "symbol": "IEF", "name": "10Y US Treasury", "weight": 0.25, "value": 2500000, "targetWeight": 0.25 },
    { "symbol": "LQD", "name": "Corporate Bonds", "weight": 0.15, "value": 1500000, "targetWeight": 0.15 },
    { "symbol": "USD", "name": "Cash Reserve", "weight": 0.15, "value": 1500000, "targetWeight": 0.15 }
  ],
  "circuitBreaker": {
    "triggered": false,
    "tier": 0,
    "message": "All risk metrics within normal parameters."
  }
}
```

---

## 2. API Endpoints

### `GET /api/portfolio`
Returns current portfolio state, weights, and live risk metrics.

### `POST /api/rebalance/optimize`
Runs Markowitz optimization with turnover penalty. Returns suggested weights and fee estimate.

### `POST /api/rebalance/execute`
Executes rebalancing (or approves pending order). Logs action in `AuditLog`.

### `POST /api/simulate/shock`
Body: `{ "type": "FLASH_CRASH" | "RATE_HIKE" | "CUSTOM", "params": { ... } }`  
Triggers shock simulator and emits Socket.io alert.

### `POST /api/ai/what-if`
Body: `{ "query": "What happens if oil rises 25% and tech drops 10%?" }`  
Returns parsed factors, simulated P&L, and AI hedging recommendation.
