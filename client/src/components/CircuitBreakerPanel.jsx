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
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
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
                Autonomous circuit breaker
              </h2>

              <span
                className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  isTriggered
                    ? "bg-[#fdf1f1] text-[#b45c5c]"
                    : "bg-[#f1f7f1] text-[#4d7c4d]"
                }`}
              >
                {isTriggered ? "Triggered" : "Healthy"}
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
              Simulate shock
            </button>
          )}
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-1 gap-4 border-t border-[#eeeeee] pt-5 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <LockKeyhole className="h-4 w-4 text-[#999]" />

          <div>
            <p className="text-[11px] text-[#999]">
              Order execution
            </p>

            <p
              className={`text-xs font-semibold ${
                isTriggered ? "text-[#b45c5c]" : "text-[#4d7c4d]"
              }`}
            >
              {isTriggered ? "Paused" : "Enabled"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-[#999]" />

          <div>
            <p className="text-[11px] text-[#999]">
              Risk monitoring
            </p>

            <p className="text-xs font-semibold text-[#4d7c4d]">
              Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-4 w-4 text-[#999]" />

          <div>
            <p className="text-[11px] text-[#999]">
              Audit logging
            </p>

            <p className="text-xs font-semibold text-[#4d7c4d]">
              Recording
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}