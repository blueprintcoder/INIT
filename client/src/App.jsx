import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import Navbar from "./components/Navbar";
import ExecutiveMetrics from "./components/ExecutiveMetrics";
import AllocationChart from "./components/AllocationChart";
import WhatIfSimulator from "./components/WhatIfSimulator";
import CircuitBreakerPanel from "./components/CircuitBreakerPanel";
import AuditFeed from "./components/AuditFeed";
import GlassCard from "./components/GlassCard";

import { initialPortfolio } from "./mock/mockData";

export default function App() {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [activeSection, setActiveSection] = useState("overview");
  const [mode, setMode] = useState("ADVISORY");

  const [circuitBreaker, setCircuitBreaker] = useState(
    initialPortfolio.circuitBreaker || {
      triggered: false,
      message:
        "All portfolio risk controls are within configured thresholds.",
    }
  );

  const totalValue = useMemo(() => {
    if (Number.isFinite(portfolio.totalValue)) {
      return portfolio.totalValue;
    }

    return portfolio.cash || 0;
  }, [portfolio.totalValue, portfolio.cash]);

  const handleSimulationChange = (simulationResult) => {
    setPortfolio((previousPortfolio) => ({
      ...previousPortfolio,
      ...simulationResult,
    }));
  };

  const handleToggleMode = () => {
    setMode((previousMode) =>
      previousMode === "AUTONOMOUS" ? "ADVISORY" : "AUTONOMOUS"
    );
  };

  const handleTriggerShock = () => {
    const updatedCircuitBreaker = {
      triggered: true,
      message:
        "Market shock detected. Order execution has been paused by the circuit breaker.",
    };

    setCircuitBreaker(updatedCircuitBreaker);

    setPortfolio((previousPortfolio) => ({
      ...previousPortfolio,
      circuitBreaker: updatedCircuitBreaker,
    }));
  };

  const handleReset = () => {
    const updatedCircuitBreaker = {
      triggered: false,
      message:
        "All portfolio risk controls are within configured thresholds.",
    };

    setCircuitBreaker(updatedCircuitBreaker);

    setPortfolio((previousPortfolio) => ({
      ...previousPortfolio,
      circuitBreaker: updatedCircuitBreaker,
    }));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717]">
      <div className="relative z-10">
        <Navbar
          mode={mode}
          onToggleMode={handleToggleMode}
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
                      ₹
                      {totalValue.toLocaleString("en-IN", {
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

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <WhatIfSimulator
                    portfolio={portfolio}
                    onSimulationChange={handleSimulationChange}
                  />

                  <AuditFeed />
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

                <AuditFeed />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}