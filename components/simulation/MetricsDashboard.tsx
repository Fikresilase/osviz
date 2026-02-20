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
    <div className="w-full flex flex-col xl:flex-row items-center gap-6 justify-between">
      {/* Simulation Controls (Main focus in footer) */}
      <div className="flex items-center gap-4 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 w-full xl:w-auto justify-between xl:justify-start">
        <div className="flex items-center gap-4">
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
              title="Step Forward (1 Tick)"
            >
              <ArrowRight size={18} />
            </button>
            <button
              onClick={reset}
              className="w-10 h-10 flex items-center justify-center bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
              title="Reset Simulation"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Algorithm Config in same block for XL */}
        <div className="flex items-center gap-4 px-4 bg-slate-900/40 rounded-xl border border-white/5 h-12">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
            className="bg-transparent text-white text-xs font-bold rounded-lg focus:outline-none cursor-pointer appearance-none pr-4"
          >
            <option value="FCFS">FCFS (Queue)</option>
            <option value="SJF">SJF (Shortest Remaining)</option>
            <option value="RR">ROUND ROBIN (Time Sliced)</option>
          </select>

          {algorithm === "RR" && (
            <div className="flex items-center gap-2 pl-4 border-l border-white/5">
              {[2, 3, 4, 6].map((q) => (
                <button
                  key={q}
                  onClick={() => setTimeQuantum(q)}
                  className={cn(
                    "w-6 h-6 rounded-md text-[10px] font-black transition-all",
                    timeQuantum === q
                      ? "bg-indigo-500 text-white shadow-md"
                      : "text-slate-500 hover:text-white",
                  )}
                  title={`Quantum: ${q} ticks`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Speed Slider */}
      <div className="flex flex-col min-w-[150px] w-full xl:w-auto max-w-sm">
        <div className="flex justify-between mb-1">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Tick Interval
          </span>
          <span className="text-[9px] font-mono text-indigo-400">
            {tickDuration}ms / tick
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="1500"
          step="50"
          value={tickDuration}
          onChange={(e) => setTickDuration(Number(e.target.value))}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 w-full xl:w-auto p-4 bg-white/[0.02] rounded-2xl border border-white/5">
        <MetricItem
          label="CPU Util"
          value={`${metrics.cpuUtilization.toFixed(0)}%`}
          color="text-emerald-400"
          tooltip="Percentage of time the CPU was busy processing jobs."
        />
        <MetricItem
          label="Done"
          value={metrics.completedProcesses}
          color="text-white"
          tooltip="Total number of successfully terminated processes."
        />
        <MetricItem
          label="Slowdown"
          value={metrics.averageSlowdown.toFixed(2)}
          color="text-indigo-400"
          tooltip="Average ratio of Turnaround Time to Burst Time. Lower is better."
        />
        <MetricItem
          label="Starvation"
          value={metrics.starvationIndex}
          color="text-orange-400"
          tooltip="Maximum ticks any process has spent waiting. High values indicate neglected jobs."
        />
        <MetricItem
          label="Throughput"
          value={(
            metrics.completedProcesses / (metrics.totalTime || 1)
          ).toFixed(3)}
          color="text-purple-400"
          tooltip="Average jobs completed per tick."
        />
      </div>
    </div>
  );
};

const MetricItem = ({
  label,
  value,
  color,
  tooltip,
}: {
  label: string;
  value: string | number;
  color: string;
  tooltip: string;
}) => (
  <div className="flex flex-col group relative cursor-help" title={tooltip}>
    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
      {label}
    </span>
    <span
      className={cn(
        "text-xs md:text-sm font-black font-mono tracking-tighter",
        color,
      )}
    >
      {value}
    </span>
    {/* Minimal Info indicator */}
    <div className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);
