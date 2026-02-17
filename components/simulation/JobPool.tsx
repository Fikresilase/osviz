import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Process } from "@/types/simulation";
import { ProcessDot } from "./ProcessDot";
import { Plus, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobPoolProps {
  processes: Process[];
  onAddProcess: (burstTime?: number) => void;
}

export const JobPool: React.FC<JobPoolProps> = ({
  processes,
  onAddProcess,
}) => {
  const [manualBurst, setManualBurst] = React.useState<string>("8");
  const newProcesses = processes.filter((p) => p.state === "NEW");

  const handleManualAdd = () => {
    const burst = parseInt(manualBurst);
    if (!isNaN(burst) && burst > 0) {
      onAddProcess(burst);
    }
  };

  return (
    <div className="glass-card h-full p-6 flex flex-col relative overflow-hidden group border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
      <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

      <div className="flex items-center justify-between mb-8 z-10">
        <h2 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2 uppercase tracking-tighter">
          <Database size={20} className="text-indigo-400" />
          Queue Entry
        </h2>
        <span className="text-[10px] font-black px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-md border border-indigo-500/30 font-mono tracking-widest uppercase">
          New: {newProcesses.length}
        </span>
      </div>

      <div className="flex-1 relative border border-white/5 rounded-2xl p-6 bg-[#020617]/40 overflow-y-auto custom-scrollbar backdrop-blur-sm z-10">
        <div className="flex flex-wrap gap-x-8 gap-y-12 content-start justify-center">
          <AnimatePresence mode="popLayout">
            {newProcesses.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 100 }}
                className="relative group/process"
              >
                <ProcessDot process={p} size="sm" showDetails />

                {/* Glow on arrival */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 rounded-full bg-white blur-xl pointer-events-none"
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {newProcesses.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-30 mt-12 grayscale">
              <Database size={48} strokeWidth={1} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Listening for inputs
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 z-10 space-y-3">
        <div className="flex gap-2 p-1.5 bg-[#020617]/40 rounded-2xl border border-white/5 backdrop-blur-sm">
          <input
            type="number"
            value={manualBurst}
            onChange={(e) => setManualBurst(e.target.value)}
            placeholder="Burst"
            className="flex-1 bg-transparent px-4 py-2 text-xs font-bold text-white outline-none placeholder:text-slate-600"
          />
          <button
            onClick={handleManualAdd}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest text-indigo-400 rounded-xl transition-all"
          >
            Manual Add
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddProcess()}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 shadow-[0_15px_30px_-10px_rgba(79,70,229,0.5)] text-white rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-xs uppercase tracking-widest"
        >
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Plus size={16} strokeWidth={3} />
          </div>
          <span>Inject Random Task</span>
        </motion.button>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
