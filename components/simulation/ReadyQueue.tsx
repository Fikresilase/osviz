import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Process } from "@/types/simulation";
import { ProcessDot } from "./ProcessDot";
import { UnfoldHorizontal } from "lucide-react";

interface ReadyQueueProps {
  processes: Process[];
  readyQueueIds: number[];
  algorithm: string;
}

export const ReadyQueue: React.FC<ReadyQueueProps> = ({
  processes,
  readyQueueIds,
  algorithm,
}) => {
  const queuedProcesses = readyQueueIds
    .map((id) => processes.find((p) => p.id === id)!)
    .filter(Boolean);

  return (
    <div className="glass-card h-full p-6 flex flex-col relative overflow-hidden group border-indigo-500/10">
      <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

      <div className="flex items-center justify-between mb-4 z-10">
        <h2 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent flex items-center gap-2 uppercase tracking-tighter">
          <UnfoldHorizontal size={20} className="text-indigo-400" />
          Ready Buffer
        </h2>
        <div className="flex gap-2 items-center">
          {algorithm === "SJF" && (
            <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider animate-pulse">
              ← Shortest First
            </span>
          )}
          {algorithm === "FCFS" && (
            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">
              ← Oldest First
            </span>
          )}
          <span className="text-[9px] font-black uppercase px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30 tracking-widest">
            {algorithm} Priority
          </span>
          <span className="text-[10px] font-mono px-3 py-1 bg-slate-900/80 rounded-lg text-slate-400 border border-white/5">
            Waiting: {queuedProcesses.length}
          </span>
        </div>
      </div>

      <div className="flex-1 relative border border-white/5 bg-[#020617]/60 rounded-2xl flex items-center overflow-x-auto overflow-y-hidden px-8 custom-scrollbar backdrop-blur-md">
        {/* Tech Track Visuals */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] border-y border-indigo-500/10 pointer-events-none" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[70%] bg-indigo-500/20 blur-xl animate-pulse" />

        <div className="flex items-center gap-10 min-w-full py-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {queuedProcesses.map((p, index) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.5, x: -100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: 100 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                className="relative"
              >
                <ProcessDot process={p} size="md" showDetails />

                {/* Queue Position Marker */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-black text-indigo-500/60 font-mono italic">
                    pos_{index + 1}
                  </span>
                </div>

                {/* Connectivity line between particles */}
                {index < queuedProcesses.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -right-10 top-1/2 -translate-y-1/2 w-10 h-px bg-gradient-to-r from-indigo-500/30 to-transparent"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {queuedProcesses.length === 0 && (
            <div className="w-full text-center flex flex-col items-center gap-2 grayscale opacity-20 select-none">
              <span className="text-xs font-black uppercase tracking-[0.6em] text-slate-500 italic">
                Buffer Idle
              </span>
              <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* Visual metaphor helper: SJF hint */}
      {algorithm === "SJF" && queuedProcesses.length > 1 && (
        <div className="mt-4 text-[9px] font-black text-indigo-500/60 flex items-center gap-2 uppercase tracking-widest px-1">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          />
          Sorting by complexity weight...
        </div>
      )}
    </div>
  );
};
