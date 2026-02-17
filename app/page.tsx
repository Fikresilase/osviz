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

  const runningProcess =
    processes.find((p) => p.id === runningProcessId) || null;

  // Initial random jobs if none exist
  useEffect(() => {
    if (processes.length === 0) {
      addProcess(12);
      addProcess(5);
      addProcess(8);
    }
  }, []);

  return (
    <main className="h-screen bg-[#020617] text-slate-200 p-6 flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* App Header */}
      <header className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 180 }}
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            <Activity className="text-white" size={24} />
          </motion.div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
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

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
              Global Clock
            </span>
            <span className="text-2xl font-mono font-bold text-indigo-400 tabular-nums leading-none">
              {currentTime.toString().padStart(4, "0")}{" "}
              <span className="text-[10px] font-sans text-slate-600">
                ticks
              </span>
            </span>
          </div>

          <div className="h-8 w-px bg-slate-800/50" />

          <div className="flex items-center gap-2">
            <Link
              href="/analytics"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all font-bold text-xs"
            >
              <BarChart2 size={16} />
              View Analytics
            </Link>
            <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white">
              <Github size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Primary Simulation View - Tighter Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 mb-4 overflow-hidden">
        {/* Left Col: Job Pool */}
        <div className="col-span-12 lg:col-span-3 h-full overflow-hidden">
          <JobPool
            processes={processes}
            onAddProcess={(burstTime) =>
              addProcess(burstTime || Math.floor(Math.random() * 12) + 4)
            }
          />
        </div>

        {/* Middle Col: Ready Queue & CPU */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ReadyQueue
              processes={processes}
              readyQueueIds={readyQueue}
              algorithm={algorithm}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <CPUCore process={runningProcess} algorithm={algorithm} />
          </div>
        </div>

        {/* Right Col: Terminated */}
        <div className="col-span-12 lg:col-span-3 h-full overflow-hidden">
          <TerminatedSink
            processes={processes}
            terminatedIds={terminatedProcessIds}
          />
        </div>
      </div>

      {/* Global Controls Area - Sticky Bottom */}
      <footer className="shrink-0 glass p-4 rounded-2xl border-white/5 bg-slate-900/40 backdrop-blur-xl">
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

      {/* Floating Sparkles Decor */}
      <div className="fixed top-0 left-1/4 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />

      <AnimatePresence>
        {metrics.starvationIndex > 20 && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-24 right-6 glass bg-orange-500/10 border-orange-500/20 p-4 rounded-2xl shadow-2xl z-50 flex items-start gap-4 max-w-sm"
          >
            <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-orange-400 font-bold text-sm">
                Starvation Alert
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                Large processes are being neglected. Switch to Round Robin or
                increase Time Quantum.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
