import React, { useRef, useEffect } from "react";
import { Process } from "@/types/simulation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ExecutionTimelineProps {
  history: (number | null)[];
  processes: Process[];
  noWrapper?: boolean;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({
  history,
  processes,
  noWrapper = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [history]);

  const blocks: { id: number | null; start: number; duration: number }[] = [];

  if (history.length > 0) {
    let currentId = history[0];
    let start = 0;
    let duration = 1;

    for (let i = 1; i <= history.length; i++) {
      const id = i < history.length ? history[i] : -999;
      if (id === currentId) {
        duration++;
      } else {
        blocks.push({ id: currentId, start, duration });
        currentId = id;
        start = i;
        duration = 1;
      }
    }
  }

  const content = (
    <>
      {!noWrapper && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <Clock size={12} />
            Execution History
          </h3>
        </div>
      )}

      <div
        ref={containerRef}
        className="flex-1 bg-slate-900/60 rounded-2xl border border-white/5 p-6 relative overflow-x-auto custom-scrollbar flex items-center min-h-[120px] backdrop-blur-sm"
      >
        <div className="flex items-center h-16 relative min-w-full">
          {/* Visual Ticks Track */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 border-y border-white/5 opacity-20 pointer-events-none" />

          {/* Execution Blocks */}
          <div className="flex h-12 items-center relative z-10">
            {blocks.map((block, idx) => {
              const process = processes.find((p) => p.id === block.id);
              return (
                <motion.div
                  key={`${block.id}-${block.start}`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  className={cn(
                    "flex-shrink-0 h-full flex items-center justify-center relative transition-all overflow-hidden",
                    block.id === null
                      ? "bg-slate-700/20 border-x border-dashed border-slate-600/30"
                      : "cursor-help rounded-lg mx-0.5 shadow-lg",
                  )}
                  style={{
                    width: `${block.duration * 40}px`,
                    backgroundColor: process?.color || "transparent",
                    originX: 0,
                    boxShadow: process
                      ? `0 4px 12px ${process.color}40`
                      : "none",
                  }}
                >
                  {block.id !== null && block.duration > 0.4 && (
                    <span className="text-[10px] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none uppercase">
                      P{block.id}
                    </span>
                  )}

                  {/* Hover Overlay Stats */}
                  {block.id !== null && (
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-white/10 flex flex-col justify-center items-center text-[8px] font-black leading-tight text-white uppercase tracking-tighter">
                      <span>t_{block.start}</span>
                      <span>Δ_{block.duration}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Time Markers */}
          <div className="absolute -bottom-2 left-0 right-0 flex pointer-events-none">
            {Array.from({ length: Math.ceil(history.length / 5) + 1 }).map(
              (_, i) => (
                <div
                  key={i}
                  className="absolute border-l border-white/10 h-2 top-0"
                  style={{ left: `${i * 5 * 40}px` }}
                >
                  <span className="absolute top-2 left-1 text-[8px] font-mono text-slate-600">
                    {i * 5}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (noWrapper) return content;

  return (
    <div className="glass-card p-6 flex flex-col h-full border-indigo-500/10">
      {content}
    </div>
  );
};
