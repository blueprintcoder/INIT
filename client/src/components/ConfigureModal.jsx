import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders, Building2, Landmark, TrendingUp, Check } from "lucide-react";
import GlassCard from "./GlassCard";

const PRESETS = [
  {
    id: "treasury",
    name: "Corporate Treasury",
    subtitle: "Conservative ($10M Baseline)",
    icon: Building2,
    totalValue: 10000000,
    cashBufferPercent: 0.15,
    maxVaR: 0.040,
    weights: { SPY: 0.25, QQQ: 0.20, IEF: 0.25, LQD: 0.15, USD: 0.15 }
  },
  {
    id: "pension",
    name: "Pension Fund",
    subtitle: "High Liquidity ($50M Heavy Bonds)",
    icon: Landmark,
    totalValue: 50000000,
    cashBufferPercent: 0.20,
    maxVaR: 0.025,
    weights: { SPY: 0.15, QQQ: 0.10, IEF: 0.35, LQD: 0.20, USD: 0.20 }
  },
  {
    id: "growth",
    name: "Tech Growth Fund",
    subtitle: "High Return ($25M Growth Tilt)",
    icon: TrendingUp,
    totalValue: 25000000,
    cashBufferPercent: 0.10,
    maxVaR: 0.050,
    weights: { SPY: 0.25, QQQ: 0.40, IEF: 0.15, LQD: 0.10, USD: 0.10 }
  }
];

export default function ConfigureModal({ isOpen, onClose, onApplyConfig, currentPortfolio }) {
  const [activePreset, setActivePreset] = useState("treasury");
  const [totalValue, setTotalValue] = useState(currentPortfolio?.totalValue || 10000000);
  const [cashBufferPct, setCashBufferPct] = useState(0.15);
  const [spyWeight, setSpyWeight] = useState(0.25);
  const [qqqWeight, setQqqWeight] = useState(0.20);
  const [iefWeight, setIefWeight] = useState(0.25);
  const [lqdWeight, setLqdWeight] = useState(0.15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setTotalValue(preset.totalValue);
    setCashBufferPct(preset.cashBufferPercent);
    setSpyWeight(preset.weights.SPY);
    setQqqWeight(preset.weights.QQQ);
    setIefWeight(preset.weights.IEF);
    setLqdWeight(preset.weights.LQD);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const usdWeight = Math.max(0, 1.0 - (spyWeight + qqqWeight + iefWeight + lqdWeight));

    const configData = {
      name: PRESETS.find(p => p.id === activePreset)?.name + " Profile",
      totalValue: Number(totalValue),
      cashBufferPercent: Number(cashBufferPct),
      holdings: [
        { symbol: "SPY", name: "S&P 500 ETF", assetClass: "EQUITY", weight: spyWeight, targetWeight: spyWeight, currentPrice: 510, volatility: 0.16 },
        { symbol: "QQQ", name: "Tech Growth ETF", assetClass: "EQUITY", weight: qqqWeight, targetWeight: qqqWeight, currentPrice: 440, volatility: 0.22 },
        { symbol: "IEF", name: "10Y US Treasury", assetClass: "FIXED_INCOME", weight: iefWeight, targetWeight: iefWeight, currentPrice: 94, volatility: 0.07 },
        { symbol: "LQD", name: "Corporate Bonds", assetClass: "FIXED_INCOME", weight: lqdWeight, targetWeight: lqdWeight, currentPrice: 108, volatility: 0.09 },
        { symbol: "USD", name: "Cash Reserve", assetClass: "CASH", weight: usdWeight, targetWeight: usdWeight, currentPrice: 1.0, volatility: 0.00 }
      ],
      policy: {
        minCashBufferPercent: Number(cashBufferPct),
        maxAllowableVaR95: 0.040
      }
    };

    await onApplyConfig(configData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#dedede]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#eef0f2] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f4f8] text-[#111]">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111]">Custom Balance Sheet Builder</h3>
                <p className="text-xs text-[#777]">Configure total capital, cash guardrails & 1-click institutional profiles</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#888] hover:bg-[#f3f4f6] hover:text-[#111]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* 1-Click Institutional Presets */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#777] mb-3 block">
                ⚡ 1-Click Institutional Profiles
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? "border-[#111] bg-[#fafafa] shadow-xs"
                          : "border-[#e5e7eb] hover:border-[#aaa] bg-white"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#111] text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      <Icon className={`h-5 w-5 mb-2 ${isSelected ? "text-[#111]" : "text-[#777]"}`} />
                      <p className="text-sm font-bold text-[#111]">{preset.name}</p>
                      <p className="text-xs text-[#777] mt-1">{preset.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Capital Inputs */}
            <GlassCard className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#555] block mb-1">Total Capital ($)</label>
                  <input
                    type="number"
                    value={totalValue}
                    onChange={(e) => setTotalValue(Number(e.target.value))}
                    min={1000000}
                    max={100000000}
                    step={1000000}
                    className="w-full rounded-lg border border-[#dedede] px-3 py-2 text-sm font-semibold text-[#111] focus:border-[#111] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#555] block mb-1">Mandatory Cash Buffer (%)</label>
                  <input
                    type="number"
                    value={Math.round(cashBufferPct * 100)}
                    onChange={(e) => setCashBufferPct(Number(e.target.value) / 100)}
                    min={10}
                    max={40}
                    step={1}
                    className="w-full rounded-lg border border-[#dedede] px-3 py-2 text-sm font-semibold text-[#111] focus:border-[#111] focus:outline-hidden"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Asset Allocation Sliders */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#777] block">
                Target Asset Allocation Weights
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#555]">
                  <span>S&P 500 ETF (SPY)</span>
                  <span className="font-bold text-[#111]">{Math.round(spyWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.05}
                  value={spyWeight}
                  onChange={(e) => setSpyWeight(Number(e.target.value))}
                  className="w-full accent-[#111]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#555]">
                  <span>Tech Growth ETF (QQQ)</span>
                  <span className="font-bold text-[#111]">{Math.round(qqqWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.05}
                  value={qqqWeight}
                  onChange={(e) => setQqqWeight(Number(e.target.value))}
                  className="w-full accent-[#111]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#555]">
                  <span>10Y US Treasury (IEF)</span>
                  <span className="font-bold text-[#111]">{Math.round(iefWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.05}
                  value={iefWeight}
                  onChange={(e) => setIefWeight(Number(e.target.value))}
                  className="w-full accent-[#111]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#555]">
                  <span>Corporate Bonds (LQD)</span>
                  <span className="font-bold text-[#111]">{Math.round(lqdWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.05}
                  value={lqdWeight}
                  onChange={(e) => setLqdWeight(Number(e.target.value))}
                  className="w-full accent-[#111]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eef0f2]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#555] hover:text-[#111] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#111] text-xs font-bold text-white hover:bg-[#333] transition-colors shadow-xs"
              >
                {isSubmitting ? "Calibrating..." : "Apply & Optimize Profile"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
