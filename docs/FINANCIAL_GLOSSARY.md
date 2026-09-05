# FinTech Cheat Sheet & Financial Glossary
> Plain-English definitions for your team and judge presentations.

---

### 1. Sharpe Ratio (Portfolio Health Score)
* **What it means:** How much profit are you generating per unit of risk/stress?
* **Analogy:** Car speed vs. fuel consumption. Moving fast on a safe highway vs. speeding through a minefield.
* **Interpretation:**
  * `< 1.0`: Poor risk efficiency.
  * `1.0 - 1.9`: **Healthy & Optimal** (Our default: `1.85`).
  * `> 2.0`: Elite performance.

---

### 2. 1-Day Value at Risk (VaR 95%)
* **What it means:** The maximum dollar loss we are 95% confident our company will NOT exceed tomorrow under normal conditions.
* **Analogy:** A weather forecast stating there is a 95% chance rainfall won't exceed 2 inches tomorrow.
* **In AegisCap:** Default VaR is `2.40%` ($240,000). During a flash crash, VaR spikes to `6.20%`, triggering the circuit breaker.

---

### 3. Cash Buffer (Liquidity Reserve)
* **What it means:** The locked emergency cash reserve strictly preserved for payroll and operating liabilities.
* **In AegisCap:** $1,500,000 (15% of the $10M balance sheet). The optimizer is mathematically prohibited from investing this money.

---

### 4. Circuit Breakers (Automated Safety Net)
* **What it means:** Automatic emergency brakes that engage when risk breaches policy limits.
* **Analogy:** An electrical circuit breaker that trips during a power surge, or ABS brakes on a car.
* **In AegisCap:** If VaR crosses 4.0%, Tier-2 de-risking automatically moves $1M from equities into risk-free US Treasury Bills and Cash.

---

### 5. Portfolio Drift
* **What it means:** When asset weights unintentionally drift away from original targets due to market price movements.
* **Example:** Tech stocks surge 50%, suddenly making up 35% of the portfolio instead of the intended 20%, exposing the company to excess risk.

---

### 6. Turnover Cost Penalty
* **What it means:** Factoring in brokerage commissions and bid-ask slippage into rebalancing math so the algorithm doesn't waste money churning small trades.
