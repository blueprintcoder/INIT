import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { io } from "socket.io-client";

import Navbar from "./components/Navbar";
import ExecutiveMetrics from "./components/ExecutiveMetrics";
import AllocationChart from "./components/AllocationChart";
import WhatIfSimulator from "./components/WhatIfSimulator";
import CircuitBreakerPanel from "./components/CircuitBreakerPanel";
import AuditFeed from "./components/AuditFeed";
import GlassCard from "./components/GlassCard";
import ConfigureModal from "./components/ConfigureModal";
import RebalanceComparison from "./components/RebalanceComparison";
import StressSliders from "./components/StressSliders";
import NaturalPolicyInput from "./components/NaturalPolicyInput";

import { initialPortfolio } from "./mock/mockData";

const API_BASE = "http://localhost:5000/api";

export default function App() {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [activeSection, setActiveSection] = useState("overview");
  const [mode, setMode] = useState("ADVISORY");
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  const [circuitBreaker, setCircuitBreaker] = useState(
    initialPortfolio.circuitBreaker || {
      triggered: false,
      message: "All portfolio risk controls are within configured thresholds.",
    }
  );

  // 1. Fetch initial portfolio state from live server on mount
  useEffect(() => {
    fetchPortfolio();
    fetchAuditLogs();

    // Connect Socket.io client for real-time market shocks and updates
    const socket = io("http://localhost:5000");

    socket.on("market-shock", (data) => {
      if (data && data.portfolio) {
        setPortfolio(data.portfolio);
        if (data.circuitBreaker) setCircuitBreaker(data.circuitBreaker);
      }
      fetchAuditLogs();
    });

    socket.on("portfolio-updated", (data) => {
      if (data) {
        setPortfolio(data);
        if (data.circuitBreaker) setCircuitBreaker(data.circuitBreaker);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio`);
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
        if (data.activeMode) setMode(data.activeMode);
        if (data.circuitBreaker) setCircuitBreaker(data.circuitBreaker);
      }
    } catch (err) {
      console.warn("Using offline fallback portfolio state", err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/ai/audit-logs`);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (err) {
      console.warn("Using default audit logs", err);
    }
  };

  const totalValue = useMemo(() => {
    if (Number.isFinite(portfolio.totalValue)) {
      return portfolio.totalValue;
    }
    return portfolio.cash || portfolio.cashBuffer || 10000000;
  }, [portfolio.totalValue, portfolio.cash, portfolio.cashBuffer]);

  const handleSimulationChange = (simulationResult) => {
    setPortfolio((previousPortfolio) => ({
      ...previousPortfolio,
      ...simulationResult,
    }));
  };

  const handleToggleMode = async () => {
    const newMode = mode === "AUTONOMOUS" ? "ADVISORY" : "AUTONOMOUS";
    setMode(newMode);
    try {
      await fetch(`${API_BASE}/portfolio/toggle-mode`, { method: "POST" });
    } catch (err) {
      console.warn("Failed to toggle mode on server", err);
    }
  };

  const handleTriggerShock = async () => {
    try {
      const res = await fetch(`${API_BASE}/simulate/flash-crash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.portfolio) setPortfolio(data.portfolio);
        if (data.circuitBreaker) setCircuitBreaker(data.circuitBreaker);
        fetchAuditLogs();
        return;
      }
    } catch (err) {
      console.warn("Local fallback shock simulation", err);
    }

    const updatedCircuitBreaker = {
      triggered: true,
      tier: 2,
      message: "Market shock detected. Tier-2 de-risking executed: $1,000,000 moved to Cash & T-Bills.",
    };
    setCircuitBreaker(updatedCircuitBreaker);
    setPortfolio((prev) => ({ ...prev, circuitBreaker: updatedCircuitBreaker }));
  };

  const handleReset = async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio/reset`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.portfolio) {
          setPortfolio(data.portfolio);
          if (data.portfolio.circuitBreaker) setCircuitBreaker(data.portfolio.circuitBreaker);
        }
        fetchAuditLogs();
        return;
      }
    } catch (err) {
      console.warn("Local reset fallback", err);
    }

    const updatedCircuitBreaker = {
      triggered: false,
      tier: 0,
      message: "All portfolio risk controls are within configured thresholds.",
    };
    setCircuitBreaker(updatedCircuitBreaker);
    setPortfolio((prev) => ({ ...prev, circuitBreaker: updatedCircuitBreaker }));
  };

  const handleSyncPrices = async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio/sync-live`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.portfolio) setPortfolio(data.portfolio);
      }
    } catch (err) {
      console.warn("Failed to sync live Yahoo Finance prices", err);
    }
  };

  const handleConfigurePortfolio = async (configData) => {
    try {
      const res = await fetch(`${API_BASE}/portfolio/configure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.portfolio) setPortfolio(data.portfolio);
        fetchAuditLogs();
      }
    } catch (err) {
      console.warn("Offline config fallback", err);
      if (configData.totalValue) {
        setPortfolio(prev => ({
          ...prev,
          totalValue: configData.totalValue,
          cashBuffer: Math.round(configData.totalValue * (configData.cashBufferPercent || 0.15))
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717]">
      <div className="relative z-10">
        <Navbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          mode={mode}
          onToggleMode={handleToggleMode}
          onOpenConfigure={() => setIsConfigureOpen(true)}
          onSyncLive={handleSyncPrices}
        />

        <main className="mx-auto w-full max-w-[1500px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {activeSection === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dedede] bg-white">
                        <ShieldCheck className="h-4 w-4 text-[#2f6b2f]" />
                      </span>

                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777]">
                        AegisCap Intelligence
                      </span>
                    </div>

                    <h1 className="max-w-4xl text-3xl font-bold tracking-[-0.04em] text-[#111] sm:text-4xl lg:text-5xl">
                      Autonomous portfolio protection,
                      <span className="block text-[#777]">
                        built for uncertain markets.
                      </span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-[#777] sm:text-base">
                      Monitor risk, simulate market shocks, and automatically
                      protect capital with explainable AI-powered controls.
                    </p>
                  </div>

                  <GlassCard className="min-w-[240px] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">
                      Portfolio value
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-[#111]">
                      $
                      {totalValue.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#3f873f]" />

                      <span className="text-xs font-medium text-[#4d7c4d]">
                        Protection system active
                      </span>
                    </div>
                  </GlassCard>
                </section>

                <ExecutiveMetrics portfolio={portfolio} />

                <NaturalPolicyInput onPolicyParsed={fetchPortfolio} />

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <AllocationChart portfolio={portfolio} />

                  <CircuitBreakerPanel
                    circuitBreaker={circuitBreaker}
                    mode={mode}
                    onToggleMode={handleToggleMode}
                    onTriggerShock={handleTriggerShock}
                    onReset={handleReset}
                  />
                </section>

                <RebalanceComparison portfolio={portfolio} />

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <WhatIfSimulator
                    portfolio={portfolio}
                    onSimulationChange={handleSimulationChange}
                  />

                  <AuditFeed logs={auditLogs} />
                </section>
              </motion.div>
            )}

            {activeSection === "simulation" && (
              <motion.div
                key="simulation"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                <section>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777]">
                    Scenario laboratory
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#111] sm:text-4xl">
                    Stress-test your portfolio
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#777]">
                    Explore how your portfolio behaves during market crashes,
                    volatility spikes, and liquidity shocks.
                  </p>
                </section>

                <StressSliders portfolio={portfolio} />

                <WhatIfSimulator
                  portfolio={portfolio}
                  onSimulationChange={handleSimulationChange}
                />

                <ExecutiveMetrics portfolio={portfolio} />
              </motion.div>
            )}

            {activeSection === "audit" && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                <section>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777]">
                    Explainability layer
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#111] sm:text-4xl">
                    Decision audit trail
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#777]">
                    Every portfolio action is recorded with its trigger,
                    confidence, and protection rationale.
                  </p>
                </section>

                <AuditFeed logs={auditLogs} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <ConfigureModal
          isOpen={isConfigureOpen}
          onClose={() => setIsConfigureOpen(false)}
          onApplyConfig={handleConfigurePortfolio}
          currentPortfolio={portfolio}
        />
      </div>
    </div>
  );
}