import React from 'react';
import { DollarSign, TrendingUp, ShieldAlert, Droplets } from 'lucide-react';

export default function ExecutiveMetrics({ data }) {
  const { totalValue, cashBuffer, metrics } = data;
  const isHealthy = metrics.status === 'HEALTHY';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
        <div className="flex justify-between items-center text-gray-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Capital</span>
          <DollarSign className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-2xl font-bold text-white">${(totalValue).toLocaleString()}</div>
        <div className="text-xs text-emerald-400 mt-1">+$34,200 (+0.34% today)</div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
        <div className="flex justify-between items-center text-gray-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Sharpe Ratio</span>
          <TrendingUp className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-white">{metrics.sharpeRatio}</div>
        <div className="text-xs text-gray-400 mt-1">Risk-Adjusted Efficiency</div>
      </div>

      <div className={`bg-[#111827] border rounded-xl p-5 ${isHealthy ? 'border-gray-800' : 'border-red-500/50 bg-red-950/20'}`}>
        <div className="flex justify-between items-center text-gray-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">1-Day VaR (95%)</span>
          <ShieldAlert className={`w-5 h-5 ${isHealthy ? 'text-emerald-400' : 'text-red-400'}`} />
        </div>
        <div className={`text-2xl font-bold ${isHealthy ? 'text-white' : 'text-red-400'}`}>
          {(metrics.var95 * 100).toFixed(2)}%
        </div>
        <div className="text-xs text-gray-400 mt-1">Max Daily Loss Threshold: 4.0%</div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
        <div className="flex justify-between items-center text-gray-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Cash Buffer</span>
          <Droplets className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-2xl font-bold text-white">${(cashBuffer).toLocaleString()}</div>
        <div className="text-xs text-emerald-400 mt-1">15.0% Locked for Payroll</div>
      </div>
    </div>
  );
}
