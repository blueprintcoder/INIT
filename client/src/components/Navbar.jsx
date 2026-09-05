import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  ShieldCheck,
} from "lucide-react";

export default function Navbar({ mode, onToggleMode }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-[#e8e8e8] bg-white/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dedede] bg-[#fafafa]">
            <ShieldCheck className="h-5 w-5 text-[#222]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-[#111]">
                AegisCap
              </h1>

              <span className="rounded-full border border-[#d9e7d9] bg-[#f1f7f1] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#4d7c4d]">
                Live
              </span>
            </div>

            <p className="text-xs text-[#999]">
              Autonomous capital intelligence
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-2 text-xs text-[#777]">
            <Activity className="h-4 w-4 text-[#4d7c4d]" />
            Risk engine operational
          </div>

          <div className="h-4 w-px bg-[#e5e5e5]" />

          <p className="text-xs text-[#999]">
            AI allocation active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-[#e2e2e2] bg-white p-2 text-[#666] transition hover:border-[#cfcfcf] hover:bg-[#f8f8f8] hover:text-[#111]"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleMode}
            className="rounded-full border border-[#dedede] bg-white px-3 py-2 text-xs font-semibold text-[#555] transition hover:border-[#c8c8c8] hover:bg-[#f7f7f7] hover:text-[#111]"
          >
            {mode === "AUTONOMOUS"
              ? "Autonomous mode"
              : "Advisory mode"}
          </button>
        </div>
      </div>
    </motion.header>
  );
}