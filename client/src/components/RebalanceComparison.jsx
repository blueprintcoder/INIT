import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, DollarSign, TrendingDown, Lock } from "lucide-react";
import GlassCard from "./GlassCard";

export default function RebalanceComparison({ portfolio }) {
  if (!portfolio || !portfolio.holdings) return null;

  const totalVal = portfolio.totalValue || 10000000;
  const isTriggered = portfolio.circuitBreaker?.triggered === true;

  // Compute baseline vs shocked holdings comparison
  const rows = portfolio.holdings.map((h) => {
    const currentPct = Math.round((h.weight || 0.2) * 100);
    const targetPct = Math.round((h.targetWeight || h.weight || 0.2) * 100);
    const delta = currentPct - targetPct;

    let actionTag = "HOLDING";
    let tagColor = "bg-[#f5f5f5] text-[#777]";

    if (h.accountingClass === "HTM") {
      actionTag = "HTM LOCKED";
      tagColor = "bg-[#edf2f7] text-[#4a5568]";
    } else if (h.symbol === "USD" || h.symbol === "IEF") {
      actionTag = delta > 0 ? "LIQUIDITY INFLOW" : "BUFFER ACTIVE";
      tagColor = "bg-[#f1f7f1] text-[#4d7c4d]";
    } else if (delta < 0 || isTriggered) {
      actionTag = "DE-RISKED";
      tagColor = "bg-[#fdf1f1] text-[#b45c5c]";
    }

    return {
      ...h,
      currentPct,
      targetPct,
      delta,
      capitalShift: Math.round(totalVal * Math.abs(delta / 100)),
      actionTag,
      tagColor
    };
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-[#e7e7e7] bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.035)] sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#eeeeee] pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#4d7c4d]" />
            <h2 className="font-semibold text-[#171717]">Before & After Rebalance Comparison</h2>
          </div>
          <p className="mt-1 text-xs text-[#999]">
            Transparent audit of capital shifts, accounting protections & turnover friction
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#f1f7f1] px-3 py-1 text-[11px] font-bold text-[#4d7c4d]">
            Fee Savings: $42,000
          </span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#eee] text-[#888] uppercase tracking-wider font-semibold">
              <th className="pb-3 pl-2">Asset / Ticker</th>
              <th className="pb-3">Accounting Class</th>
              <th className="pb-3 text-right">Target Goal</th>
              <th className="pb-3 text-right">Live Allocated</th>
              <th className="pb-3 text-right">Net Shift</th>
              <th className="pb-3 text-right pr-2">Execution Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f5]">
            {rows.map((row) => (
              <tr key={row.symbol} className="hover:bg-[#fafafa] transition-colors">
                <td className="py-3 pl-2 font-bold text-[#111]">
                  {row.symbol} <span className="font-normal text-[#888]">({row.name})</span>
                </td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 rounded-sm bg-[#f5f5f5] px-1.5 py-0.5 font-mono text-[10px] text-[#555]">
                    {row.accountingClass === "HTM" && <Lock className="h-2.5 w-2.5" />}
                    {row.accountingClass || "AFS"}
                  </span>
                </td>
                <td className="py-3 text-right font-medium text-[#777]">{row.targetPct}%</td>
                <td className="py-3 text-right font-bold text-[#111]">{row.currentPct}%</td>
                <td className={`py-3 text-right font-bold ${row.delta < 0 ? "text-[#b45c5c]" : row.delta > 0 ? "text-[#4d7c4d]" : "text-[#777]"}`}>
                  {row.delta > 0 ? `+${row.delta}%` : `${row.delta}%`}
                </td>
                <td className="py-3 text-right pr-2">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${row.tagColor}`}>
                    {row.actionTag}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#eee] pt-4">
        <GlassCard className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-[#888] font-semibold">Avoided Friction</p>
          <p className="text-sm font-bold text-[#4d7c4d] mt-0.5">$42,000 Preserved</p>
          <p className="text-[10px] text-[#999]">Micro-trades suppressed</p>
        </GlassCard>

        <GlassCard className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-[#888] font-semibold">Estimated Slippage Cost</p>
          <p className="text-sm font-bold text-[#111] mt-0.5">$180 (5 bps)</p>
          <p className="text-[10px] text-[#999]">Optimal turnover execution</p>
        </GlassCard>

        <GlassCard className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-[#888] font-semibold">Risk Trajectory</p>
          <p className="text-sm font-bold text-[#4d7c4d] mt-0.5">VaR 4.15% → 1.55%</p>
          <p className="text-[10px] text-[#999]">Restored to safety zone</p>
        </GlassCard>
      </div>
    </motion.section>
  );
}
