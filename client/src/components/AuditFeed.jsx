import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

const defaultEvents = [
  {
    id: 1,
    type: "SYSTEM",
    title: "Risk engine initialized",
    description: "All portfolio controls are active.",
    time: "2 minutes ago",
    icon: Activity,
  },
  {
    id: 2,
    type: "AI",
    title: "Allocation optimization completed",
    description:
      "Target weights generated using risk-adjusted optimization.",
    time: "5 minutes ago",
    icon: Bot,
  },
  {
    id: 3,
    type: "CONTROL",
    title: "Cash buffer verified",
    description: "Minimum liquidity requirement is satisfied.",
    time: "8 minutes ago",
    icon: ShieldCheck,
  },
];

export default function AuditFeed() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.25,
        ease: "easeOut",
      }}
      className="overflow-hidden rounded-2xl border border-[#e7e7e7] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.035)]"
    >
      <div className="flex items-center justify-between border-b border-[#eeeeee] p-5 sm:p-6">
        <div>
          <h2 className="font-semibold text-[#171717]">
            Audit activity
          </h2>

          <p className="mt-1 text-xs text-[#999]">
            Recent system and AI decisions
          </p>
        </div>

        <span className="rounded-full border border-[#e2e2e2] bg-[#fafafa] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#888]">
          Immutable log
        </span>
      </div>

      <div className="divide-y divide-[#eeeeee]">
        {defaultEvents.map((event, index) => {
          const Icon = event.icon;

          return (
            <motion.div
              key={`${event.id}-${event.title}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.35 + index * 0.04,
                duration: 0.2,
                ease: "easeOut",
              }}
              className="flex gap-4 p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f5]">
                <Icon className="h-4 w-4 text-[#666]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#333]">
                    {event.title}
                  </p>

                  <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#999]">
                    {event.type}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-[#888]">
                  {event.description}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#aaa]">
                  <Clock3 className="h-3 w-3" />
                  {event.time}
                </div>
              </div>

              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#78a378]" />
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}