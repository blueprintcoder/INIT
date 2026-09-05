# AegisCap — Autonomous Capital Optimization & Risk Controls
> **Hackathon Track:** FinTech – Asset & Capital Management / Optimization Controls  
> **Team Members:** Jeet (Lead & GenAI), Yash (Frontend & UX), Aniket (Math & Data Models)  
> **Tech Stack:** MERN (MongoDB, Express, React, Node.js) + GenAI (Gemini / OpenAI)

---

## 1. Executive Summary & Problem Breakdown
Financial institutions manage complex balance sheets across diverse asset classes, tight liquidity requirements, and rapidly shifting market conditions. When markets become volatile, traditional manual rebalancing and static risk controls break down—leading to delayed execution, sub-optimal capital utilization, and unexpected exposure to risk.

**The Solution:**
**AegisCap** is an autonomous capital optimization and explainable risk control engine. It bridges mathematical optimization (Markowitz Mean-Variance with a Turnover Cost Penalty) with real-world liquidity buffers and dynamic, multi-tier circuit breakers. It equips executives with a real-time reactive dashboard, a natural language "What-If" crisis simulator, and automated AI Risk Audit Memos.

---

## 2. The 3 Core Pillars (What We Solve)

### Pillar 1: Optimization Strategy
- Allocates capital across Equities, Fixed Income, Government Debt, Gold, and Cash.
- Maximizes the Sharpe Ratio while subtracting a **Turnover Cost Penalty** (broker fees and bid-ask slippage).
- Enforces strict hard constraints:
  1. Mandatory Liquidity Buffer: At least 15% locked in liquid Cash / T-Bills for payroll & obligations.
  2. Single-Asset Cap: Max 20% in any volatile asset.
  3. Fully invested condition: Sum of weights = 1.0.

### Pillar 2: Control & Safeguard System
- Real-time continuous evaluation of **Value at Risk (VaR 95%)** and **Conditional VaR (CVaR)**.
- **3-Tier Circuit Breaker:**
  - **Tier 1 (Drift > ±3%):** Passive cost-aware rebalancing recommendation.
  - **Tier 2 (VaR > 5% or 24h drop > 4%):** Automated de-risking into Cash/T-Bills.
  - **Tier 3 (Emergency Lockdown):** Capital freeze & emergency hedge when liquidity < 5%.
- **Dual-Control Governance:**
  - *Advisory Mode:* System recommends, human clicks `[Approve]`.
  - *Circuit Breaker Mode:* Pre-authorized emergency de-risking into cash only.

### Pillar 3: Decision Dashboard & GenAI Officer
- Executive Bloomberg-style dark cockpit.
- **Explainable AI (XAI) Audit Memos:** Plain-English rationale for every automated action.
- **Conversational Crisis Stress-Testing:** Translates queries like *"What if oil rises 25% and tech drops 10%?"* into numerical shock simulations.

---

## 3. Scoring Criteria Alignment

| Focus Area | Weight | How AegisCap Excels |
| :--- | :--- | :--- |
| **Financial & Control Logic** | **35%** | Markowitz Mean-Variance, turnover friction penalties, parametric VaR/CVaR, and 3-tier circuit breakers. |
| **Technical Architecture** | **30%** | Modular MERN stack, WebSockets (Socket.io) for live reactive updates, clean Mongoose audit trails. |
| **User Experience & Clarity** | **20%** | Executive Dark Mode UI, color-coded risk gauges, interactive allocation charts, and instant shock trigger buttons. |
| **Innovation & Problem Approach** | **15%** | GenAI Risk Officer generating trade memos, natural language stress-testing, and conversational policy ingestion. |
