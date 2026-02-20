"use client";

import React, { useEffect } from "react";
import { useSchedulerContext } from "@/context/SchedulerContext";
import { JobPool } from "@/components/simulation/JobPool";
import { ReadyQueue } from "@/components/simulation/ReadyQueue";
import { CPUCore } from "@/components/simulation/CPUCore";
import { TerminatedSink } from "@/components/simulation/TerminatedSink";
import { MetricsDashboard } from "@/components/simulation/MetricsDashboard";
import { Activity, BarChart2, Info, Github, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function OSVizPage() {
  const scheduler = useSchedulerContext();
  const {
    processes,
    readyQueue,
    runningProcessId,
    terminatedProcessIds,
    currentTime,
    algorithm,
    metrics,
    addProcess,
    tick,
    reset,
    isPlaying,
    setIsPlaying,
    setAlgorithm,
    timeQuantum,
    setTimeQuantum,
    tickDuration,
    setTickDuration,
  } = scheduler;

  const avgBurstTime =
    processes.length > 0
      ? processes.reduce((acc, p) => acc + p.burstTime, 0) / processes.length
      : 0;

  // RR is starvation-free, but can have high latency.
  const starvationThreshold =
    algorithm === "RR"
      ? Math.max(40, avgBurstTime * 4)
      : Math.max(20, avgBurstTime * 2.5);

  const runningProcess =
    processes.find((p) => p.id === runningProcessId) || null;

  // Initial random jobs if none exist
  useEffect(() => {
    if (processes.length === 0) {
      addProcess(12);
      addProcess(5);
      addProcess(10);
      addProcess(4);
    }
  }, []);

  return (
    <main className="h-screen bg-[#020617] text-slate-200 flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* App Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 pb-4 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 180 }}
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            <Activity className="text-white" size={24} />
          </motion.div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              OS-Viz{" "}
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-md font-mono border border-indigo-500/30">
                SIMULATOR
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
              Real-time Process Dynamics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex flex-col items-end">
            <span className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest">
              Global Clock
            </span>
            <span className="text-lg md:text-2xl font-mono font-bold text-indigo-400 tabular-nums leading-none">
              {currentTime.toString().padStart(4, "0")}{" "}
              <span className="text-[10px] font-sans text-slate-600">
                ticks
              </span>
            </span>
          </div>

          <div className="h-8 w-px bg-slate-800/50 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Link
              href="/analytics"
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all font-bold text-xs"
            >
              <BarChart2 size={16} />
              Analytics
            </Link>
            <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white hidden xs:block">
              <Github size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Primary Simulation View - Responsive Grid */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6 pb-4">
        <div className="grid grid-cols-12 gap-6 group/sim">
          {/* Left Col: Job Pool */}
          <div className="col-span-12 lg:col-span-3">
            <JobPool
              processes={processes}
              onAddProcess={(burstTime) =>
                addProcess(burstTime || Math.floor(Math.random() * 12) + 4)
              }
            />
          </div>

          {/* Middle Col: Ready Queue & CPU */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
            <div>
              <ReadyQueue
                processes={processes}
                readyQueueIds={readyQueue}
                algorithm={algorithm}
              />
            </div>
            <div>
              <CPUCore process={runningProcess} algorithm={algorithm} />
            </div>
          </div>

          {/* Right Col: Terminated */}
          <div className="col-span-12 lg:col-span-3">
            <TerminatedSink
              processes={processes}
              terminatedIds={terminatedProcessIds}
            />
          </div>
        </div>
      </div>

      {/* Global Controls Area - Fixed Bottom with Blur */}
      <footer className="shrink-0 z-50 glass p-4 mx-4 md:mx-6 mb-4 rounded-2xl border-white/5 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        <MetricsDashboard
          metrics={metrics}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          timeQuantum={timeQuantum}
          setTimeQuantum={setTimeQuantum}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          tick={tick}
          reset={reset}
          tickDuration={tickDuration}
          setTickDuration={setTickDuration}
        />
      </footer>

      {/* Background Ambience */}
      <div className="fixed top-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />

      <AnimatePresence>
        {metrics.starvationIndex > starvationThreshold && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-24 right-4 md:right-8 glass bg-orange-500/10 border-orange-500/20 p-4 md:p-6 rounded-2xl shadow-2xl z-[60] flex items-start gap-4 max-w-sm"
          >
            <div className="bg-orange-500 p-2.5 rounded-xl text-white shadow-lg shadow-orange-500/20 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-orange-400 font-bold text-sm">
                {algorithm === "RR"
                  ? "High Latency Detected"
                  : "Starvation Alert"}
              </h4>
              <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed mt-1">
                {algorithm === "RR"
                  ? `Process density is causing significant latency (${metrics.starvationIndex} ticks). Fairness is maintained, but throughput is struggling.`
                  : `Processes are starving! Some have waited over ${starvationThreshold.toFixed(0)} ticks (${(metrics.starvationIndex / (avgBurstTime || 1)).toFixed(1)}x avg burst).`}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] font-bold text-orange-300 uppercase tracking-widest">
                  Recommendation:
                </span>
                <span className="text-[10px] text-slate-300">
                  {algorithm === "RR"
                    ? "Increase Time Quantum"
                    : "Switch to Round Robin"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
