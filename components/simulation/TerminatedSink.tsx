import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Process } from "@/types/simulation";
import { Archive, CheckCircle2, Trophy, Clock } from "lucide-react";

interface TerminatedSinkProps {
  processes: Process[];
  terminatedIds: number[];
}

export const TerminatedSink: React.FC<TerminatedSinkProps> = ({
  processes,
  terminatedIds,
}) => {
  const finishedProcesses = terminatedIds
    .map((id) => processes.find((p) => p.id === id)!)
    .filter(Boolean)
    .reverse(); // Show newest first

  return (
    <div className="glass-card h-full p-6 flex flex-col relative overflow-hidden group border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
      <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

      <div className="flex items-center justify-between mb-8 z-10">
        <h2 className="text-xl font-black bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent flex items-center gap-2 uppercase tracking-tighter">
          <Archive size={20} className="text-emerald-400" />
          Archive
        </h2>
        <span className="text-[10px] font-black px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30 font-mono tracking-widest uppercase">
          T: {finishedProcesses.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 z-10">
        <AnimatePresence initial={false} mode="popLayout">
          {finishedProcesses.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col gap-4 group/item hover:border-emerald-500/30 transition-all backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg"
                    style={{
                      backgroundColor: p.color,
                      boxShadow: `0 8px 16px -4px ${p.color}80`,
                    }}
                  >
                    P{p.id}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      Completed
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono">
                      <Clock size={8} />
                      ts_{p.completionTime}
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                  <CheckCircle2 size={16} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5 flex flex-col items-center">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Waiting
                  </span>
                  <span className="text-xs font-black text-indigo-400 font-mono">
                    {p.waitingTime}ms
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5 flex flex-col items-center">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Turnaround
                  </span>
                  <span className="text-xs font-black text-amber-400 font-mono">
                    {p.turnaroundTime}ms
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {finishedProcesses.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-6 opacity-20 grayscale mt-12 select-none">
            <div className="w-20 h-20 rounded-3xl border border-slate-700 flex items-center justify-center border-dashed">
              <Archive size={32} strokeWidth={1} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-center max-w-[150px] leading-loose">
              Storage bank waiting for terminations
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
