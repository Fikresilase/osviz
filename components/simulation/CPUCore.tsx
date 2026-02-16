import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Process } from "@/types/simulation";
import { ProcessDot } from "./ProcessDot";
import { Cpu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CPUCoreProps {
  process: Process | null;
  algorithm: string;
}

export const CPUCore: React.FC<CPUCoreProps> = ({ process, algorithm }) => {
  return (
    <div className="glass-card h-full p-6 flex flex-col relative overflow-hidden group">
      {/* Dynamic Background visualizer */}
      <div className="absolute inset-0 z-0 opacity-20 flex items-center justify-center overflow-hidden">
        {process ? (
          <div className="w-full h-full flex items-center justify-center">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-indigo-500/30 rounded-full"
                style={{ width: (i + 1) * 100, height: (i + 1) * 100 }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,1)_0%,transparent_100%)]" />
        )}
      </div>

      <div className="flex items-center justify-between mb-4 z-10">
        <h2 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
          <Zap
            className={cn(
              "w-5 h-5",
              process
                ? "text-indigo-400 fill-indigo-400 animate-pulse"
                : "text-slate-600",
            )}
          />
          CPU CORE
        </h2>
        <span
          className={cn(
            "text-[10px] font-black px-3 py-1 rounded-lg transition-all tracking-widest",
            process
              ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              : "bg-slate-800 text-slate-500",
          )}
        >
          {process ? "ACTIVE" : "IDLE"}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Core Architecture Meta-Visual */}
        <div
          className={cn(
            "w-56 h-56 rounded-[2.5rem] border flex items-center justify-center transition-all duration-700 relative",
            process
              ? "border-indigo-500/50 bg-indigo-500/5 shadow-[0_0_50px_-10px_rgba(99,102,241,0.3)] rotate-0"
              : "border-slate-800 border-dashed bg-transparent rotate-45 scale-90",
          )}
        >
          {/* Rotating Rings */}
          {process && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-t-2 border-indigo-500/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 border-b-2 border-cyan-500/30 rounded-full"
              />
            </>
          )}

          <AnimatePresence mode="wait">
            {process ? (
              <motion.div
                key={process.id}
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="relative z-10 flex flex-col items-center"
              >
                {/* Process Visualization */}
                <ProcessDot process={process} size="lg" />

                <div className="mt-8 text-center space-y-1">
                  <motion.div
                    key={process.remainingTime}
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-white font-black text-3xl font-mono tabular-nums"
                  >
                    {process.remainingTime}
                    <span className="text-sm text-indigo-400 ml-1">MS</span>
                  </motion.div>
                  <div className="text-slate-500 text-[9px] uppercase tracking-[0.3em] font-black">
                    Execution Cycle
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-4 opacity-30 select-none grayscale -rotate-45">
                <Cpu size={64} strokeWidth={1} className="text-slate-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                  Standby
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Waveform at bottom */}
        {process && (
          <div className="absolute bottom-4 left-0 right-0 h-8 flex items-end justify-center gap-1 overflow-hidden px-8">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-indigo-500/40 rounded-full"
                animate={{ height: [4, Math.random() * 20 + 8, 4] }}
                transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
