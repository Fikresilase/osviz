"use client";

import React from "react";
import { useSchedulerContext } from "@/context/SchedulerContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  ArrowLeft,
  Activity,
  Users,
  Trophy,
  History,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { ExecutionTimeline } from "@/components/simulation/ExecutionTimeline";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const { metrics, history, processes, algorithm } = useSchedulerContext();

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:scale-110 transition-all group shrink-0"
          >
            <ArrowLeft
              className="text-slate-400 group-hover:text-white transition-colors"
              size={20}
            />
          </Link>
          <div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight text-white flex flex-wrap items-center gap-2 md:gap-3">
              Performance Analytics
              <span className="text-[10px] md:text-xs bg-indigo-500/20 text-indigo-400 px-2 md:px-3 py-1 rounded-full border border-indigo-500/30 font-mono">
                {algorithm}
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Deep dive into CPU scheduling efficiency.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
            <Clock size={16} className="text-blue-400" />
            <span className="text-lg md:text-xl font-mono font-bold text-white uppercase tracking-tighter">
              {metrics.totalTime}{" "}
              <span className="text-xs text-slate-500">Ticks</span>
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Metric Overview Card */}
        <div className="md:col-span-2 lg:col-span-1 space-y-8">
          <MetricSection
            title="Resource Efficiency"
            icon={<Activity size={20} className="text-emerald-400" />}
          >
            <LargeMetricCard
              label="CPU Utilization"
              value={`${metrics.cpuUtilization.toFixed(1)}%`}
              description="CPU time spent on tasks."
              progress={metrics.cpuUtilization}
              color="emerald"
            />
          </MetricSection>

          <MetricSection
            title="Response Metrics"
            icon={<TrendingUp size={20} className="text-blue-400" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <SmallMetricCard
                label="Avg Waiting Time"
                value={`${metrics.averageWaitTime.toFixed(2)}ms`}
                color="blue"
                icon={<Users size={16} />}
              />
              <SmallMetricCard
                label="Avg Turnaround"
                value={`${metrics.averageTurnaroundTime.toFixed(2)}ms`}
                color="amber"
                icon={<Trophy size={16} />}
              />
              <SmallMetricCard
                label="Throughput"
                value={`${(metrics.completedProcesses / (metrics.totalTime || 1)).toFixed(3)} p/t`}
                color="purple"
                icon={<BarChart3 size={16} />}
              />
              <SmallMetricCard
                label="Avg Slowdown"
                value={metrics.averageSlowdown.toFixed(2)}
                color="indigo"
                icon={<Activity size={16} />}
              />
              <SmallMetricCard
                label="Latency Index"
                value={metrics.starvationIndex}
                color="blue"
                icon={<Clock size={16} />}
              />
            </div>
          </MetricSection>
        </div>

        {/* Detailed Timeline & Process Stats */}
        <div className="md:col-span-2 lg:col-span-2 space-y-8">
          <div className="glass-card p-4 md:p-6 h-[250px] md:h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-sm md:text-lg font-bold text-white flex items-center gap-2">
                <History size={18} className="text-indigo-400" />
                Execution Flow
              </h3>
            </div>
            <div className="flex-1 overflow-hidden">
              <ExecutionTimeline
                history={history}
                processes={processes}
                noWrapper
              />
            </div>
          </div>

          <div className="glass-card p-4 md:p-6 min-h-[400px]">
            <h3 className="text-sm md:text-lg font-bold text-white mb-6">
              Process Breakdown
            </h3>
            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 font-black">
                    <th className="pb-4">ID</th>
                    <th className="pb-4">Arrival</th>
                    <th className="pb-4">Burst</th>
                    <th className="pb-4">Start</th>
                    <th className="pb-4">End</th>
                    <th className="pb-4">Wait</th>
                    <th className="pb-4">Turn</th>
                    <th className="pb-4">Slow</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {processes.map((p) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-lg"
                              style={{
                                backgroundColor: p.color,
                                boxShadow: `0 4px 12px ${p.color}40`,
                              }}
                            >
                              P{p.id}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-mono text-[10px] md:text-xs text-slate-400">
                          {p.arrivalTime}t
                        </td>
                        <td className="py-4 font-mono text-[10px] md:text-xs text-slate-400">
                          {p.burstTime}t
                        </td>
                        <td className="py-4 font-mono text-[10px] md:text-xs text-slate-400">
                          {p.startTime ?? "-"}
                        </td>
                        <td className="py-4 font-mono text-[10px] md:text-xs text-slate-400">
                          {p.completionTime ?? "-"}
                        </td>
                        <td className="py-4 font-mono text-[10px] md:text-xs font-bold text-blue-400">
                          {p.waitingTime ?? "-"}
                        </td>
                        <td className="py-4 font-mono text-[10px] md:text-xs font-bold text-amber-400">
                          {p.turnaroundTime ?? "-"}
                        </td>
                        <td className="py-4 font-mono text-[10px] md:text-xs font-bold text-indigo-400">
                          {p.slowdown?.toFixed(2) ?? "-"}
                        </td>
                        <td className="py-4">
                          <span
                            className={cn(
                              "text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                              p.state === "TERMINATED"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                : p.state === "RUNNING"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/20 animate-pulse"
                                  : "bg-slate-800/40 text-slate-500 border border-white/5",
                            )}
                          >
                            {p.state}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        {icon}
        <h2 className="text-[10px] md:text-xs uppercase font-black tracking-[0.2em] text-slate-500">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function LargeMetricCard({ label, value, description, progress, color }: any) {
  const colors = {
    emerald:
      "from-emerald-600/20 to-emerald-950/10 border-emerald-500/20 text-emerald-400",
  };
  return (
    <div
      className={cn(
        "glass-card p-6 md:p-8 bg-gradient-to-br border relative overflow-hidden",
        (colors as any)[color],
      )}
    >
      <div className="relative z-10">
        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </span>
        <div className="text-4xl md:text-6xl font-black font-mono my-2 text-white tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {value}
        </div>
        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-[200px]">
          {description}
        </p>
        <div className="mt-6 md:mt-8 h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
          />
        </div>
      </div>
      <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-5">
        <Activity size={120} />
      </div>
    </div>
  );
}

function SmallMetricCard({ label, value, color, icon }: any) {
  const colors = {
    blue: "text-blue-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
    indigo: "text-indigo-400",
  };
  return (
    <div className="glass-card p-6 flex items-center justify-between group hover:border-white/10 transition-all cursor-default">
      <div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">
          {label}
        </span>
        <div
          className={cn(
            "text-2xl font-black font-mono",
            (colors as any)[color],
          )}
        >
          {value}
        </div>
      </div>
      <div
        className={cn(
          "w-10 h-10 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform",
          (colors as any)[color],
        )}
      >
        {icon}
      </div>
    </div>
  );
}
