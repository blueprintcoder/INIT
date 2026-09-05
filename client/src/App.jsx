import React, { useState } from 'react';
import ExecutiveMetrics from './components/ExecutiveMetrics';
import CircuitBreakerPanel from './components/CircuitBreakerPanel';
import AllocationChart from './components/AllocationChart';
import WhatIfSimulator from './components/WhatIfSimulator';
import AuditFeed from './components/AuditFeed';
import { initialPortfolio } from './mock/mockData';

export default function App() {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [auditMemo, setAuditMemo] = useState(null);

  const handleToggleMode = () => {
    setPortfolio(prev => ({
      ...prev,
      activeMode: prev.activeMode === 'ADVISORY' ? 'AUTONOMOUS' : 'ADVISORY'
    }));
  };

  const handleTriggerShock = async () => {
    // In local demo, simulate the shock right away!
    setPortfolio(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        var95: 0.062,
        status: 'CRITICAL'
      },
      circuitBreaker: {
        triggered: true,
        tier: 2,
        message: 'EMERGENCY: 1-Day VaR spiked to 6.2%. Autonomous Tier-2 De-risking triggered.'
      }
    }));

    setAuditMemo(`[AUTONOMOUS INTERVENTION AUDIT LOG]
Trigger: 1-Day VaR spiked to 6.2% (Threshold: 4.0%) due to market shock.
Action: Shifted $1,000,000 from Equities into Cash & US Treasuries.
Risk Restored: Projected VaR reduced to 3.2%.
Liquidity Buffer: Preserved at 22.0% ($2,200,000).
Slippage Prevented: ~$42,000.`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            AEGIS<span className="text-blue-500">CAP</span>
          </h1>
          <p className="text-xs text-gray-400">Autonomous Capital Optimization & Explainable Risk Engine</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-gray-300">Live Engine Connected</span>
        </div>
      </header>

      <ExecutiveMetrics data={portfolio} />
      <CircuitBreakerPanel
        circuitBreaker={portfolio.circuitBreaker}
        mode={portfolio.activeMode}
        onToggleMode={handleToggleMode}
        onTriggerShock={handleTriggerShock}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AllocationChart holdings={portfolio.holdings} />
        <WhatIfSimulator />
      </div>

      <AuditFeed memo={auditMemo} />
    </div>
  );
}
