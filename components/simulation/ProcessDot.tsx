import React from "react";
import { motion } from "framer-motion";
import { Process } from "@/types/simulation";
import { cn } from "@/lib/utils";

interface ProcessDotProps {
  process: Process;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export const ProcessDot: React.FC<ProcessDotProps> = ({
  process,
  size = "md",
  showDetails = false,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-14 h-14 text-sm",
    lg: "w-24 h-24 text-2xl",
  };

  return (
    <motion.div
      layoutId={`process-dot-${process.id}`}
      className={cn(
        "rounded-2xl flex items-center justify-center font-black text-white relative cursor-pointer overflow-visible",
        sizeClasses[size],
      )}
      style={{
        backgroundColor: process.color,
        boxShadow: `0 10px 30px -10px ${process.color}, 0 0 20px ${process.color}20`,
      }}
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 45 }}
      whileHover={{ y: -5, scale: 1.05 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Inner Glossy Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl pointer-events-none" />

      <span className="z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        P{process.id}
      </span>

      {/* State Badge */}
      {size === "lg" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-3 -right-3 px-2 py-1 bg-white text-black text-[10px] font-black rounded-lg shadow-xl"
        >
          {process.state}
        </motion.div>
      )}

      {/* Floating Particles or Pulse for Running state */}
      {process.state === "RUNNING" && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-4 border-white/50"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">
            {process.remainingTime}ms
          </div>
          {/* Visual Progress Bar under dot */}
          <div className="w-12 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{
                width: `${(process.remainingTime / process.burstTime) * 100}%`,
              }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
