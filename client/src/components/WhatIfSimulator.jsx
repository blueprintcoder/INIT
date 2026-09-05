import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

export default function WhatIfSimulator() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = () => {
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    window.setTimeout(() => {
      setResult({
        title: "Scenario analyzed successfully",
        summary:
          "The portfolio remains within acceptable risk limits under this scenario.",
        actions: [
          "Increase defensive allocation by 3%",
          "Reduce technology exposure by 2%",
          "Maintain minimum cash buffer at 12%",
        ],
      });

      setLoading(false);
    }, 700);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.25,
        duration: 0.25,
        ease: "easeOut",
      }}
      className="overflow-hidden rounded-2xl border border-[#e7e7e7] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.035)]"
    >
      <div className="border-b border-[#eeeeee] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5]">
            <Bot className="h-5 w-5 text-[#555]" />
          </div>

          <div>
            <h2 className="font-semibold text-[#171717]">
              What-if simulator
            </h2>

            <p className="mt-1 text-xs text-[#999]">
              Ask AegisCap to evaluate a market scenario
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="relative">
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Example: What happens if the technology sector falls by 15%?"
            rows={4}
            className="w-full resize-none rounded-xl border border-[#e2e2e2] bg-[#fafafa] p-4 text-sm text-[#222] outline-none placeholder:text-[#aaa] transition focus:border-[#bdbdbd] focus:bg-white focus:ring-2 focus:ring-[#eeeeee]"
          />

          <button
            type="button"
            onClick={runSimulation}
            disabled={!query.trim() || loading}
            className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg bg-[#171717] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                Running
              </>
            ) : (
              <>
                Analyze
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Rates rise by 1%",
            "Equities fall by 10%",
            "Cash requirement increases",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuery(suggestion)}
              className="rounded-lg border border-[#e2e2e2] bg-white px-3 py-2 text-[11px] text-[#777] transition hover:border-[#cfcfcf] hover:bg-[#f8f8f8] hover:text-[#222]"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-5 overflow-hidden rounded-xl border border-[#dce8dc] bg-[#f7fbf7]"
          >
            <div className="flex items-start gap-3 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4d7c4d]" />

              <div>
                <p className="text-sm font-semibold text-[#4d7c4d]">
                  {result.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#777]">
                  {result.summary}
                </p>
              </div>
            </div>

            <div className="border-t border-[#e3eee3] px-4 py-3">
              <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#888]">
                <Sparkles className="h-3.5 w-3.5 text-[#777]" />
                Recommended actions
              </p>

              <div className="space-y-2">
                {result.actions.map((action) => (
                  <div
                    key={action}
                    className="flex items-center gap-2 text-xs text-[#555]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#777]" />
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}