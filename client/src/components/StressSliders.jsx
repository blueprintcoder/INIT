import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sliders, ShieldAlert, TrendingDown, RefreshCw, Zap } from "lucide-react";
import GlassCard from "./GlassCard";

export default function StressSliders({ portfolio }) {
  const [equityShock, setEquityShock] = useState(-0.12);
  const [rateHikeBps, setRateHikeBps] = useState(75);
  const [oilShock, setOilShock] = useState(0.20);

  const totalValue = portfolio?.totalValue || 10000000;

  // Real-time quantitative stress calculations
  const stressResults = useMemo(() => {
    const equityWeight = 0.45;
    const bondWeight = 0.40;
    const bondDuration = 5.2;

    const rateImpactPct = -bondDuration * (rateHikeBps / 10000);
    const oilEquityDrag = oilShock * 0.15;

    const netEquityShock = equityShock - oilEquityDrag;
    const projectedLoss = Math.round(totalValue * (equityWeight * netEquityShock + bondWeight * rateImpactPct));

    const baselineVol = 0.084;
    const shockMultiplier = 1 + Math.abs(netEquityShock) * 3 + (rateHikeBps / 100) * 0.4;
    const projectedDailyVol = (baselineVol / Math.sqrt(252)) * shockMultiplier;
    const projectedVaR = 1.645 * projectedDailyVol;
    const projectedCVaR = projectedVaR * 1.28;
    const projectedDrawdown = Math.abs(Math.min(0, projectedLoss / totalValue)) * 100 + 2.5;

    let expectedTier = 0;
    let tierAction = "TIER 0 — NORMAL OPERATIONS";
    let tierColor = "bg-[#f1f7f1] text-[#4d7c4d] border-[#dce8dc]";

    if (projectedVaR >= 0.055) {
      expectedTier = 3;
      tierAction = "TIER 3 — EMERGENCY LOCKDOWN (Repo Sweep)";
      tierColor = "bg-[#fdf1f1] text-[#b45c5c] border-[#e8caca]";
    } else if (projectedVaR >= 0.040) {
      expectedTier = 2;
      tierAction = "TIER 2 — AUTONOMOUS DE-RISK (T-Bills)";
      tierColor = "bg-[#fff7ed] text-[#c2410c] border-[#ffedd5]";
    } else if (projectedVaR >= 0.032) {
      expectedTier = 1;
      tierAction = "TIER 1 — DRIFT WARNING (Restrict Corp Debt)";
      tierColor = "bg-[#fefce8] text-[#a16207] border-[#fef08a]";
    }

    return {
      projectedLoss,
      projectedLossFormatted: (projectedLoss < 0 ? "-$" : "+$") + Math.abs(projectedLoss).toLocaleString(),
      projectedVaR: (projectedVaR * 100).toFixed(2) + "%",
      projectedCVaR: (projectedCVaR * 100).toFixed(2) + "%",
      projectedDrawdown: projectedDrawdown.toFixed(1) + "%",
      expectedTier,
      tierAction,
      tierColor
    };
  }, [equityShock, rateHikeBps, oilShock, totalValue]);

  const handleResetSliders = () => {
    setEquityShock(0);
    setRateHikeBps(0);
    setOilShock(0);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-[#e7e7e7] bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.035)] sm:p-6"
    >
      <div className="flex items-center justify-between border-b border-[#eeeeee] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5]">
            <Sliders className="h-5 w-5 text-[#333]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#171717]">Interactive Macro Stress Sliders</h2>
            <p className="text-xs text-[#999]">Simulate live yield shifts, equity sell-offs & commodity shocks</p>
          </div>
        </div>

        <button
          onClick={handleResetSliders}
          className="flex items-center gap-1.5 rounded-lg border border-[#e2e2e2] bg-white px-3 py-1.5 text-xs font-semibold text-[#666] hover:bg-[#f8f8f8]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Sliders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Column */}
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#333]">Equity Market Shock</span>
              <span className={`font-bold ${equityShock < 0 ? "text-[#b45c5c]" : "text-[#4d7c4d]"}`}>
                {equityShock > 0 ? `+${Math.round(equityShock * 100)}%` : `${Math.round(equityShock * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min={-0.30}
              max={0.30}
              step={0.02}
              value={equityShock}
              onChange={(e) => setEquityShock(Number(e.target.value))}
              className="w-full accent-[#111]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#333]">Fed Rate Hike Shift</span>
              <span className="font-bold text-[#b45c5c]">+{rateHikeBps} bps</span>
            </div>
            <input
              type="range"
              min={0}
              max={300}
              step={25}
              value={rateHikeBps}
              onChange={(e) => setRateHikeBps(Number(e.target.value))}
              className="w-full accent-[#111]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#333]">Oil & Commodity Shock</span>
              <span className="font-bold text-[#9a7a3a]">+{Math.round(oilShock * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.50}
              step={0.05}
              value={oilShock}
              onChange={(e) => setOilShock(Number(e.target.value))}
              className="w-full accent-[#111]"
            />
          </div>
        </div>

        {/* Real-time Projected Readout Column */}
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${stressResults.tierColor}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider">Expected Circuit Breaker Response</p>
            <p className="text-sm font-bold mt-1">{stressResults.tierAction}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <GlassCard className="p-3">
              <p className="text-[10px] uppercase text-[#888] font-semibold">Projected P&L Impact</p>
              <p className={`text-lg font-bold mt-1 ${stressResults.projectedLoss < 0 ? "text-[#b45c5c]" : "text-[#4d7c4d]"}`}>
                {stressResults.projectedLossFormatted}
              </p>
            </GlassCard>

            <GlassCard className="p-3">
              <p className="text-[10px] uppercase text-[#888] font-semibold">Projected 1-Day VaR</p>
              <p className="text-lg font-bold text-[#111] mt-1">{stressResults.projectedVaR}</p>
            </GlassCard>

            <GlassCard className="p-3">
              <p className="text-[10px] uppercase text-[#888] font-semibold">1-Day CVaR (Tail Risk)</p>
              <p className="text-lg font-bold text-[#111] mt-1">{stressResults.projectedCVaR}</p>
            </GlassCard>

            <GlassCard className="p-3">
              <p className="text-[10px] uppercase text-[#888] font-semibold">Max Est. Drawdown</p>
              <p className="text-lg font-bold text-[#b45c5c] mt-1">{stressResults.projectedDrawdown}</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
