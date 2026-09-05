import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Gauge,
  ShieldAlert,
  Wallet,
} from "lucide-react";

function formatCurrency(value = 0) {
  const safeValue = Number.isFinite(Number(value))
    ? Number(value)
    : 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(safeValue);
}

export default function ExecutiveMetrics({ portfolio }) {
  if (!portfolio) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
        Portfolio data is missing.
      </div>
    );
  }

  const {
    metrics = {},
    totalValue = 0,
    cash = 0,
  } = portfolio;

  const safeTotalValue = Number(totalValue) || 0;
  const safeCash = Number(cash) || 0;

  const cashPercentage =
    safeTotalValue > 0
      ? ((safeCash / safeTotalValue) * 100).toFixed(1)
      : "0.0";

  const isCritical = metrics.status === "CRITICAL";
  const pnl = Number(metrics.pnl) || 0;

  const cards = [
    {
      title: "Total portfolio value",
      value: formatCurrency(safeTotalValue),
      change: "+2.8%",
      description: "Since last rebalance",
      icon: Wallet,
      iconColor: "text-[#4d7c4d]",
      iconBackground: "bg-[#f1f7f1]",
      positive: true,
    },
    {
      title: "Daily P&L",
      value: formatCurrency(pnl),
      change: pnl >= 0 ? "+0.34%" : "-1.84%",
      description: "Today's performance",
      icon: pnl >= 0 ? ArrowUpRight : ArrowDownRight,
      iconColor: pnl >= 0 ? "text-[#4d7c4d]" : "text-[#b45c5c]",
      iconBackground: pnl >= 0 ? "bg-[#f1f7f1]" : "bg-[#fdf1f1]",
      positive: pnl >= 0,
    },
    {
      title: "Sharpe ratio",
      value: Number(metrics.sharpe ?? 0).toFixed(2),
      change: "Strong",
      description: "Risk-adjusted return",
      icon: Gauge,
      iconColor: "text-[#555]",
      iconBackground: "bg-[#f5f5f5]",
      positive: true,
    },
    {
      title: "Value at Risk",
      value: `${((Number(metrics.var95) || 0) * 100).toFixed(1)}%`,
      change: isCritical ? "Limit breached" : "Within limit",
      description: `95% one-day VaR · ${cashPercentage}% cash`,
      icon: ShieldAlert,
      iconColor: isCritical ? "text-[#b45c5c]" : "text-[#9a7a3a]",
      iconBackground: isCritical ? "bg-[#fdf1f1]" : "bg-[#fbf7ed]",
      positive: !isCritical,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: index * 0.025,
              ease: "easeOut",
            }}
            whileHover={{
              y: -3,
              transition: {
                duration: 0.12,
                ease: "easeOut",
              },
            }}
            className="rounded-2xl border border-[#e7e7e7] bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.035)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBackground}`}
              >
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>

              <span
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                  card.positive
                    ? "bg-[#f1f7f1] text-[#4d7c4d]"
                    : "bg-[#fdf1f1] text-[#b45c5c]"
                }`}
              >
                {card.positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}

                {card.change}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-xs font-medium text-[#888]">
                {card.title}
              </p>

              <p className="mt-2 break-words text-2xl font-bold tracking-tight text-[#111]">
                {card.value}
              </p>

              <p className="mt-2 text-xs text-[#999]">
                {card.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}