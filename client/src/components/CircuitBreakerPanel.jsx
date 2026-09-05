import React from 'react';
import { AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export default function CircuitBreakerPanel({ circuitBreaker, mode, onToggleMode, onTriggerShock }) {
  const isTriggered = circuitBreaker.triggered;

  return (
    <div className={`border rounded-xl p-5 mb-6 ${isTriggered ? 'bg-red-950/30 border-red-500' : 'bg-[#111827] border-gray-800'}`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {isTriggered ? (
            <div className="p-3 bg-red-600/20 rounded-lg text-red-400 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
          ) : (
            <div className="p-3 bg-emerald-600/20 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-white">
              {isTriggered ? 'CIRCUIT BREAKER ACTIVATED: TIER 2' : 'Autonomous Risk Shield Active'}
            </h3>
            <p className="text-xs text-gray-400">{circuitBreaker.message}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMode}
            className="px-4 py-2 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg border border-gray-700 transition"
          >
            Mode: <span className="text-blue-400 font-bold">{mode}</span>
          </button>

          <button
            onClick={onTriggerShock}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg shadow-red-600/20 transition"
          >
            <Zap className="w-4 h-4" />
            Simulate Flash Crash (-12%)
          </button>
        </div>
      </div>
    </div>
  );
}
