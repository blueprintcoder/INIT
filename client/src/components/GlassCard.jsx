import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  delay = 0,
  hover = true,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay,
        ease: "easeOut",
      }}
      whileHover={
        hover
          ? {
              y: -3,
              transition: {
                duration: 0.12,
                ease: "easeOut",
              },
            }
          : undefined
      }
      className={`rounded-2xl border border-[#e7e7e7] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.035)] ${className}`}
    >
      {children}
    </motion.div>
  );
}