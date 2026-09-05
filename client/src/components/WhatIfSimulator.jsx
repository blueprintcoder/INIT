import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function WhatIfSimulator() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSimulate = () => {
    if (!query) return;
    setResult({
      projectedPnL: '-$240,000 (-2.4%)',
      liquidityImpact: 'Cash reserve preserved at 15.2%',
      recommendation: 'Pre-emptively shift 4% from long-term bonds into short-term floating notes.'
    });
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h3 className="text-base font-semibold text-white">AI What-If Crisis Simulator</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4">Ask natural language questions to test hypothetical macro scenarios against your balance sheet.</p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., What if the Fed hikes interest rates by 75 bps and oil jumps 25%?"
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSimulate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
        >
          Simulate <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {result && (
        <div className="bg-gray-900/70 border border-blue-500/30 rounded-lg p-4 text-xs">
          <div className="text-red-400 font-semibold mb-1">Projected Balance Impact: {result.projectedPnL}</div>
          <div className="text-emerald-400 mb-1">{result.liquidityImpact}</div>
          <div className="text-gray-300">💡 {result.recommendation}</div>
        </div>
      )}
    </div>
  );
}
