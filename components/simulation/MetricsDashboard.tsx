import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Activity,
  Settings,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { SchedulerMetrics, AlgorithmType } from "@/types/simulation";
import { cn } from "@/lib/utils";

interface MetricsDashboardProps {
  metrics: SchedulerMetrics;
  algorithm: AlgorithmType;
  setAlgorithm: (a: AlgorithmType) => void;
  timeQuantum: number;
  setTimeQuantum: (q: number) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  tick: () => void;
  reset: () => void;
  tickDuration: number;
  setTickDuration: (d: number) => void;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  algorithm,
  setAlgorithm,
  timeQuantum,
  setTimeQuantum,
  isPlaying,
  setIsPlaying,
  tick,
  reset,
  tickDuration,
  setTickDuration,
}) => {
  return (
    <div className="w-full flex flex-wrap items-center gap-6 justify-between">
      {/* Simulation Controls (Main focus in footer) */}
      <div className="flex items-center gap-4 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg",
            isPlaying
              ? "bg-red-500 text-white shadow-red-500/20"
              : "bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500",
          )}
        >
          {isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" className="ml-1" />
          )}
        </button>
        <div className="flex gap-1 pr-2">
          <button
            onClick={tick}
            disabled={isPlaying}
            className="w-10 h-10 flex items-center justify-center bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-20 transition-all"
            title="Next Tick"
          >
            <ArrowRight size={18} />
          </button>
          <button
            onClick={reset}
            className="w-10 h-10 flex items-center justify-center bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Speed Slider */}
      <div className="flex flex-col min-w-[150px]">
        <div className="flex justify-between mb-1">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Warp Speed
          </span>
          <span className="text-[9px] font-mono text-indigo-400">
            {tickDuration}ms
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="1500"
          step="50"
          value={tickDuration}
          onChange={(e) => setTickDuration(Number(e.target.value))}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Algorithm Config */}
      <div className="flex items-center gap-4 py-2 px-4 bg-slate-800/30 rounded-xl border border-white/5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Settings size={12} />
          Mechanism
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
          className="bg-transparent text-white text-xs font-bold rounded-lg focus:outline-none cursor-pointer appearance-none pr-4"
        >
          <option value="FCFS">FCFS (Queue)</option>
          <option value="SJF">SJF (Shortest)</option>
          <option value="RR">ROUND ROBIN</option>
        </select>

        {algorithm === "RR" && (
          <div className="flex items-center gap-2 pl-4 border-l border-white/5">
            {[2, 3, 4].map((q) => (
              <button
                key={q}
                onClick={() => setTimeQuantum(q)}
                className={cn(
                  "w-6 h-6 rounded-md text-[10px] font-black transition-all",
                  timeQuantum === q
                    ? "bg-indigo-500 text-white shadow-md"
                    : "text-slate-500 hover:text-white",
                )}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mini Metrics for Simulation screen */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            CPU Util
          </span>
          <span className="text-sm font-black text-emerald-400 font-mono tracking-tighter">
            {metrics.cpuUtilization.toFixed(0)}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Completed
          </span>
          <span className="text-sm font-black text-white font-mono tracking-tighter">
            {metrics.completedProcesses}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Slowdown
          </span>
          <span className="text-sm font-black text-indigo-400 font-mono tracking-tighter">
            {metrics.averageSlowdown.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Starvation
          </span>
          <span className="text-sm font-black text-orange-400 font-mono tracking-tighter">
            {metrics.starvationIndex}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Throughput
          </span>
          <span className="text-sm font-black text-purple-400 font-mono tracking-tighter">
            {(metrics.completedProcesses / (metrics.totalTime || 1)).toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
};
