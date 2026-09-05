import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  LockKeyhole,
  Power,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function CircuitBreakerPanel({
  circuitBreaker,
  mode,
  onToggleMode,
  onTriggerShock,
  onReset,
}) {
  const isTriggered = circuitBreaker?.triggered === true;
  const currentTier = circuitBreaker?.tier !== undefined ? circuitBreaker.tier : (isTriggered ? 2 : 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.2,
        duration: 0.25,
        ease: "easeOut",
      }}
      className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.035)] sm:p-6 ${
        isTriggered
          ? "border-[#e8caca]"
          : "border-[#dce8dc]"
      }`}
    >
      {/* Header Bar */}
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between border-b border-[#eeeeee] pb-5">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              isTriggered ? "bg-[#fdf1f1]" : "bg-[#f1f7f1]"
            }`}
          >
            {isTriggered ? (
              <AlertTriangle className="h-6 w-6 text-[#b45c5c]" />
            ) : (
              <ShieldCheck className="h-6 w-6 text-[#4d7c4d]" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-[#171717]">
                Autonomous 3-Tier Circuit Breaker
              </h2>

              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isTriggered
                    ? "bg-[#fdf1f1] text-[#b45c5c]"
                    : "bg-[#f1f7f1] text-[#4d7c4d]"
                }`}
              >
                {isTriggered ? `Tier-${currentTier} Breaker Active` : "Tier-0 Healthy"}
              </span>
            </div>

            <p className="mt-1 max-w-2xl text-sm text-[#888]">
              {circuitBreaker?.message ||
                "All portfolio risk controls are within configured thresholds."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleMode}
            className="rounded-xl border border-[#dedede] bg-white px-4 py-2.5 text-xs font-semibold text-[#555] transition hover:bg-[#f7f7f7] hover:text-[#111]"
          >
            {mode === "AUTONOMOUS"
              ? "Switch to advisory"
              : "Switch to autonomous"}
          </button>

          {isTriggered ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-xl border border-[#dce8dc] bg-[#f1f7f1] px-4 py-2.5 text-xs font-semibold text-[#4d7c4d] transition hover:bg-[#e8f2e8]"
            >
              <Power className="h-4 w-4" />
              Restore system
            </button>
          ) : (
            <button
              type="button"
              onClick={onTriggerShock}
              className="inline-flex items-center gap-2 rounded-xl border border-[#eadada] bg-[#fdf5f5] px-4 py-2.5 text-xs font-semibold text-[#a85d5d] transition hover:bg-[#fbeded]"
            >
              <Zap className="h-4 w-4" />
              Simulate flash crash (-12%)
            </button>
          )}
        </div>
      </div>

      {/* 3-Tier Visual Indicator Bar */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-3 rounded-xl border ${currentTier === 1 ? "border-[#fef08a] bg-[#fefce8]" : "border-[#eee] bg-[#fafafa]"}`}>
          <div className="flex items-center justify-between text-xs font-bold text-[#111]">
            <span>Tier 1 — Drift Warning</span>
            {currentTier === 1 && <span className="text-[10px] text-[#a16207] bg-[#fef08a] px-1.5 py-0.5 rounded-full">ACTIVE</span>}
          </div>
          <p className="text-[11px] text-[#777] mt-1">VaR 3.5%–4.0%. Restricts long corp bonds, channels into T-Bills.</p>
        </div>

        <div className={`p-3 rounded-xl border ${currentTier === 2 ? "border-[#ffedd5] bg-[#fff7ed]" : "border-[#eee] bg-[#fafafa]"}`}>
          <div className="flex items-center justify-between text-xs font-bold text-[#111]">
            <span>Tier 2 — De-Risk Active</span>
            {currentTier === 2 && <span className="text-[10px] text-[#c2410c] bg-[#ffedd5] px-1.5 py-0.5 rounded-full">ACTIVE</span>}
          </div>
          <p className="text-[11px] text-[#777] mt-1">VaR ≥ 4.0%. Auto de-risks $1M from equities to T-Bills & Cash.</p>
        </div>

        <div className={`p-3 rounded-xl border ${currentTier === 3 ? "border-[#e8caca] bg-[#fdf1f1]" : "border-[#eee] bg-[#fafafa]"}`}>
          <div className="flex items-center justify-between text-xs font-bold text-[#111]">
            <span>Tier 3 — Lockdown</span>
            {currentTier === 3 && <span className="text-[10px] text-[#b45c5c] bg-[#fdf1f1] px-1.5 py-0.5 rounded-full">ACTIVE</span>}
          </div>
          <p className="text-[11px] text-[#777] mt-1">VaR ≥ 5.5%. Freezes new disbursements, enters overnight repo.</p>
        </div>
      </div>

      {/* Trigger Breakdown Accordion Panel */}
      {isTriggered && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-4 rounded-xl border border-[#e8caca] bg-[#fff9f9] text-xs space-y-2"
        >
          <p className="font-bold text-[#b45c5c] flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            Why was Tier-{currentTier} Breaker Triggered?
          </p>
          <ul className="space-y-1 text-[#555] pl-5 list-disc">
            <li><strong>Equity Shock:</strong> Tech equities (QQQ) plummeted by 14%, S&P (SPY) by 10%.</li>
            <li><strong>VaR Breach:</strong> 1-Day VaR spiked from 1.19% to 4.15%, breaching the 4.0% policy cap.</li>
            <li><strong>Autonomous Intervention:</strong> Reallocated $1,000,000 to Cash & Treasuries.</li>
            <li><strong>Liquidity Guardrail:</strong> 15% ($1,500,000) mandatory payroll cash buffer preserved.</li>
          </ul>
        </motion.div>
      )}

      {/* Footer System Badges */}
      <div className="relative mt-4 grid grid-cols-1 gap-4 border-t border-[#eeeeee] pt-4 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <LockKeyhole className="h-4 w-4 text-[#999]" />
          <div>
            <p className="text-[11px] text-[#999]">Order execution</p>
            <p className={`text-xs font-semibold ${isTriggered ? "text-[#b45c5c]" : "text-[#4d7c4d]"}`}>
              {isTriggered ? "Paused by Circuit Breaker" : "Enabled"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-[#999]" />
          <div>
            <p className="text-[11px] text-[#999]">Risk monitoring</p>
            <p className="text-xs font-semibold text-[#4d7c4d]">Active (1-Day VaR 95%)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-4 w-4 text-[#999]" />
          <div>
            <p className="text-[11px] text-[#999]">Audit logging</p>
            <p className="text-xs font-semibold text-[#4d7c4d]">Recording to DB</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}