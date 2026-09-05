import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  ShieldCheck,
  RefreshCw,
  Sliders,
  BarChart3,
  FlaskConical,
  FileText
} from "lucide-react";

export default function Navbar({
  activeSection = "overview",
  setActiveSection,
  mode = "ADVISORY",
  onToggleMode,
  onOpenConfigure,
  onSyncLive
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-[#e8e8e8] bg-white/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
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
                Live Engine
              </span>
            </div>

            <p className="text-xs text-[#999]">
              Autonomous capital intelligence
            </p>
          </div>
        </div>

        {/* Center Tabs Navigation */}
        <div className="hidden items-center gap-1 rounded-full border border-[#e5e5e5] bg-[#fafafa] p-1.5 md:flex">
          <button
            type="button"
            onClick={() => setActiveSection && setActiveSection("overview")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activeSection === "overview"
                ? "bg-white text-[#111] shadow-xs"
                : "text-[#666] hover:text-[#111]"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveSection && setActiveSection("simulation")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activeSection === "simulation"
                ? "bg-white text-[#111] shadow-xs"
                : "text-[#666] hover:text-[#111]"
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            Stress Lab
          </button>

          <button
            type="button"
            onClick={() => setActiveSection && setActiveSection("audit")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activeSection === "audit"
                ? "bg-white text-[#111] shadow-xs"
                : "text-[#666] hover:text-[#111]"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Audit Trail
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onSyncLive}
            title="Sync prices with live Yahoo Finance market data"
            className="flex items-center gap-1.5 rounded-full border border-[#dedede] bg-white px-3 py-1.5 text-xs font-semibold text-[#555] transition hover:border-[#c8c8c8] hover:bg-[#f7f7f7] hover:text-[#111]"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#3b82f6]" />
            <span className="hidden sm:inline">Sync Prices</span>
          </button>

          <button
            type="button"
            onClick={onOpenConfigure}
            className="flex items-center gap-1.5 rounded-full border border-[#dedede] bg-white px-3 py-1.5 text-xs font-semibold text-[#555] transition hover:border-[#c8c8c8] hover:bg-[#f7f7f7] hover:text-[#111]"
          >
            <Sliders className="h-3.5 w-3.5 text-[#111]" />
            <span>Configure</span>
          </button>

          <button
            type="button"
            onClick={onToggleMode}
            className="rounded-full border border-[#dedede] bg-[#111] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#333]"
          >
            {mode === "AUTONOMOUS" ? "Autonomous" : "Advisory"}
          </button>
        </div>
      </div>
    </motion.header>
  );
}