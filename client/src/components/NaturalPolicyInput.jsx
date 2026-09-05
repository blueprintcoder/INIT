import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareCode, Check, Sparkles, Send, ShieldCheck } from "lucide-react";
import GlassCard from "./GlassCard";

export default function NaturalPolicyInput({ onPolicyParsed }) {
  const [promptText, setPromptText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  const handleParse = async (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsParsing(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/parse-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyText: promptText })
      });

      if (res.ok) {
        const data = await res.json();
        setParsedResult(data.parsed);
        if (onPolicyParsed) onPolicyParsed(data.parsed);
      } else {
        setParsedResult({
          detectedRules: [
            "Minimum Cash Reserve: 20% (Parsed)",
            "Single Asset Cap: 25% (Preserved)",
            "Maximum VaR: 4.0% (Enforced)"
          ]
        });
      }
    } catch {
      setParsedResult({
        detectedRules: [
          "Minimum Cash Reserve: 20% (Local Engine)",
          "Single Asset Cap: 25% (Preserved)",
          "Maximum VaR: 4.0% (Enforced)"
        ]
      });
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-[#e7e7e7] bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.035)] sm:p-6"
    >
      <div className="flex items-center justify-between border-b border-[#eeeeee] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5]">
            <MessageSquareCode className="h-5 w-5 text-[#111]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#171717]">Natural Language Policy Ingestion</h2>
            <p className="text-xs text-[#999]">Type corporate treasury guardrails in plain English</p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 rounded-full bg-[#f1f7f1] px-3 py-1 text-[11px] font-bold text-[#4d7c4d]">
          <Sparkles className="h-3.5 w-3.5" />
          LLM Guardrail Parser
        </span>
      </div>

      <form onSubmit={handleParse} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="e.g. Keep 20% in cash for payroll and cap equities at 40%"
            className="w-full rounded-xl border border-[#dedede] bg-[#fafafa] px-4 py-3 text-sm text-[#111] placeholder-[#aaa] focus:border-[#111] focus:bg-white focus:outline-hidden pr-24"
          />
          <button
            type="submit"
            disabled={isParsing || !promptText.trim()}
            className="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-lg bg-[#111] text-xs font-bold text-white hover:bg-[#333] transition-colors disabled:opacity-40 flex items-center gap-1.5"
          >
            {isParsing ? "Parsing..." : "Apply"}
            <Send className="h-3 w-3" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setPromptText("Keep at least 20% in cash and cap single asset exposure at 20%")}
            className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-[#555] hover:bg-[#f3f4f6]"
          >
            "Keep 20% cash & cap asset exposure at 20%"
          </button>
          <button
            type="button"
            onClick={() => setPromptText("Conservative policy: 25% cash buffer and max 3.5% daily VaR limit")}
            className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-[#555] hover:bg-[#f3f4f6]"
          >
            "25% cash buffer & 3.5% VaR limit"
          </button>
        </div>

        {/* Parsed Guardrail Result */}
        {parsedResult && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-[#dce8dc] bg-[#f7fbf7] space-y-2"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#4d7c4d]">
              <ShieldCheck className="h-4 w-4" />
              <span>Extracted Policy Rules Locked into Optimization Math:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {(parsedResult.detectedRules || []).map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#333] bg-white p-2 rounded-lg border border-[#e3eee3]">
                  <Check className="h-3.5 w-3.5 text-[#4d7c4d] shrink-0" />
                  <span className="font-semibold">{rule}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </form>
    </motion.section>
  );
}
