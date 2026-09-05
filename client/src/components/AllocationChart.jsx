import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[#e5e5e5] bg-white p-3 shadow-xl">
      <p className="mb-2 text-xs font-semibold text-[#222]">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-6 text-xs"
        >
          <span className="text-[#888]">{item.name}</span>

          <span className="font-semibold text-[#222]">
            {item.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AllocationChart({ portfolio }) {
  const holdings = portfolio?.holdings || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.15,
        duration: 0.25,
        ease: "easeOut",
      }}
      className="overflow-hidden rounded-2xl border border-[#e7e7e7] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.035)]"
    >
      <div className="flex flex-col gap-2 border-b border-[#eeeeee] p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <h2 className="font-semibold text-[#171717]">
            Capital allocation
          </h2>

          <p className="mt-1 text-xs text-[#999]">
            Current portfolio versus optimized target
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-[#888]">
            <span className="h-2 w-2 rounded-full bg-[#222]" />
            Current
          </div>

          <div className="flex items-center gap-2 text-[#888]">
            <span className="h-2 w-2 rounded-full bg-[#9ca3af]" />
            Target
          </div>
        </div>
      </div>

      <div className="h-[320px] px-2 pb-5 sm:px-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={holdings}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 5,
            }}
            barGap={8}
          >
            <CartesianGrid
              stroke="#eeeeee"
              vertical={false}
            />

            <XAxis
              dataKey="symbol"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#888888",
                fontSize: 11,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#888888",
                fontSize: 11,
              }}
              domain={[0, 40]}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              cursor={{ fill: "#f7f7f7" }}
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="current"
              name="Current"
              fill="#222222"
              radius={[5, 5, 0, 0]}
              animationDuration={500}
            />

            <Bar
              dataKey="target"
              name="Target"
              fill="#b8b8b8"
              radius={[5, 5, 0, 0]}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-[#eeeeee] p-5 sm:grid-cols-5">
        {holdings.map((holding, index) => (
          <motion.div
            key={holding.symbol}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25 + index * 0.025,
              duration: 0.2,
              ease: "easeOut",
            }}
            className="rounded-xl bg-[#fafafa] p-3"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#777]" />

              <span className="text-xs font-semibold text-[#444]">
                {holding.symbol}
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-[#171717]">
              {holding.current}%
            </p>

            <p className="mt-1 text-[10px] text-[#999]">
              Target {holding.target}%
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}