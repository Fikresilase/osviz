import { useState, useCallback, useEffect, useRef } from "react";
import {
  Process,
  SchedulerMetrics,
  AlgorithmType,
  ProcessState,
} from "@/types/simulation";

const PROCESS_COLORS = [
  "#3B82F6", // Blue-500
  "#A855F7", // Purple-500
  "#10B981", // Emerald-500
  "#F59E0B", // Amber-500
  "#EF4444", // Red-500
  "#EC4899", // Pink-500
  "#06B6D4", // Cyan-500
  "#8B5CF6", // Violet-500
];

const INITIAL_METRICS: SchedulerMetrics = {
  totalTime: 0,
  cpuUtilization: 0,
  completedProcesses: 0,
  averageWaitTime: 0,
  averageTurnaroundTime: 0,
  averageSlowdown: 0,
  starvationIndex: 0,
};

const DEFAULT_QUANTUM = 2;

export const useScheduler = () => {
  // Single source of truth for simulation state to ensure atomic updates
  const [state, setState] = useState<{
    processes: Process[];
    readyQueue: number[];
    runningProcessId: number | null;
    terminatedProcessIds: number[];
    currentTime: number;
    quantumCounter: number;
    cpuBusyTime: number;
    history: (number | null)[];
  }>({
    processes: [],
    readyQueue: [],
    runningProcessId: null,
    terminatedProcessIds: [],
    currentTime: 0,
    quantumCounter: 0,
    cpuBusyTime: 0,
    history: [],
  });

  const [algorithm, setAlgorithm] = useState<AlgorithmType>("RR");
  const [timeQuantum, setTimeQuantum] = useState(DEFAULT_QUANTUM);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickDuration, setTickDuration] = useState(1000);
  const [metrics, setMetrics] = useState<SchedulerMetrics>(INITIAL_METRICS);

  const processIdCounter = useRef(1);

  const addProcess = useCallback((burstTime: number) => {
    setState((prev) => {
      const id = processIdCounter.current++;
      const color = PROCESS_COLORS[(id - 1) % PROCESS_COLORS.length];
      const newProcess: Process = {
        id,
        color,
        arrivalTime: prev.currentTime, // Arrives NOW
        burstTime,
        remainingTime: burstTime,
        state: "NEW",
        waitingTime: 0,
        turnaroundTime: 0,
      };
      return {
        ...prev,
        processes: [...prev.processes, newProcess],
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      processes: [],
      readyQueue: [],
      runningProcessId: null,
      terminatedProcessIds: [],
      currentTime: 0,
      quantumCounter: 0,
      cpuBusyTime: 0,
      history: [],
    });
    setMetrics(INITIAL_METRICS);
    setIsPlaying(false);
    processIdCounter.current = 1;
  }, []);

  const tick = useCallback(() => {
    setState((prev) => {
      let nextProcesses = prev.processes.map((p) => ({ ...p }));
      let nextReadyQueue = [...prev.readyQueue];
      let nextRunningId = prev.runningProcessId;
      let nextTerminatedIds = [...prev.terminatedProcessIds];
      let nextQuantumCounter = prev.quantumCounter;
      let nextCpuBusyTime = prev.cpuBusyTime;
      const nextTime = prev.currentTime + 1;

      // 1. Move NEW -> READY if arrival time reached
      // Actually, in the UI user just adds them, but if we supported future arrivals:
      // For this sim, "Add Process" inputs a process at CurrentTime.
      // But if we had a prefill, we'd check here.
      nextProcesses.forEach((p) => {
        if (p.state === "NEW" && p.arrivalTime <= nextTime) {
          p.state = "READY";
          if (!nextReadyQueue.includes(p.id)) {
            nextReadyQueue.push(p.id);
          }
        }
      });

      // 2. Process Running Job
      let processFinished = false;
      let processPreempted = false;

      if (nextRunningId !== null) {
        const runningProc = nextProcesses.find((p) => p.id === nextRunningId);
        if (runningProc) {
          runningProc.remainingTime -= 1;
          nextQuantumCounter += 1;
          nextCpuBusyTime += 1; // CPU did work

          if (runningProc.remainingTime <= 0) {
            // Finished
            runningProc.state = "TERMINATED";
            runningProc.completionTime = nextTime;
            runningProc.turnaroundTime = nextTime - runningProc.arrivalTime;
            runningProc.waitingTime =
              runningProc.turnaroundTime - runningProc.burstTime;
            runningProc.slowdown =
              runningProc.turnaroundTime / runningProc.burstTime;

            nextTerminatedIds.push(runningProc.id);
            nextRunningId = null;
            nextQuantumCounter = 0;
            processFinished = true;
          } else {
            // Check Preemption
            if (algorithm === "RR" && nextQuantumCounter >= timeQuantum) {
              // RR Slice Expired
              // Only preempt if there are others waiting
              if (nextReadyQueue.length > 0) {
                runningProc.state = "READY";
                nextReadyQueue.push(runningProc.id);
                nextRunningId = null;
                nextQuantumCounter = 0;
                processPreempted = true;
              } else {
                // Reset counter but keep running
                nextQuantumCounter = 0;
              }
            }
          }
        }
      }

      // 3. Increment Waiting Time for those in Ready Queue
      // This is purely for live metrics or debugging
      // Correct Turnaround/Wait calculation is done at termination from timestamps.

      // 4. Dispatcher
      if (nextRunningId === null && nextReadyQueue.length > 0) {
        // Sort based on Algorithm
        if (algorithm === "SJF") {
          // Non-preemptive SJF sorting (at dispatch time)
          nextReadyQueue.sort((a, b) => {
            const pA = nextProcesses.find((p) => p.id === a)!;
            const pB = nextProcesses.find((p) => p.id === b)!;
            return pA.burstTime - pB.burstTime;
          });
        } else if (algorithm === "FCFS") {
          // Sort by Arrival Time
          nextReadyQueue.sort((a, b) => {
            const pA = nextProcesses.find((p) => p.id === a)!;
            const pB = nextProcesses.find((p) => p.id === b)!;
            return pA.arrivalTime - pB.arrivalTime;
          });
        }
        // RR is FCFS within the queue logic (shift/push)

        const nextId = nextReadyQueue.shift();
        if (nextId) {
          nextRunningId = nextId;
          const proc = nextProcesses.find((p) => p.id === nextId);
          if (proc) {
            proc.state = "RUNNING";
            if (proc.startTime === undefined) proc.startTime = nextTime;
          }
        }
      }

      // Update Metrics
      // Calculate strictly from terminated processes
      const terminatedProcs = nextProcesses.filter(
        (p) => p.state === "TERMINATED",
      );
      const totalWait = terminatedProcs.reduce(
        (acc, p) => acc + (p.waitingTime || 0),
        0,
      );
      const totalTurnaround = terminatedProcs.reduce(
        (acc, p) => acc + (p.turnaroundTime || 0),
        0,
      );
      const totalSlowdown = terminatedProcs.reduce(
        (acc, p) => acc + (p.slowdown || 0),
        0,
      );

      const count = terminatedProcs.length;
      const avgWait = count > 0 ? totalWait / count : 0;
      const avgTurnaround = count > 0 ? totalTurnaround / count : 0;
      const avgSlowdown = count > 0 ? totalSlowdown / count : 0;
      const util = nextTime > 0 ? (nextCpuBusyTime / nextTime) * 100 : 0;

      // Calculate Starvation Index: Max wait time of any non-terminated process
      const livingProcs = nextProcesses.filter((p) => p.state !== "TERMINATED");
      const maxWait =
        livingProcs.length > 0
          ? Math.max(
              ...livingProcs.map(
                (p) =>
                  nextTime - p.arrivalTime - (p.burstTime - p.remainingTime),
              ),
            )
          : 0;

      setMetrics({
        totalTime: nextTime,
        cpuUtilization: util,
        completedProcesses: count,
        averageWaitTime: avgWait,
        averageTurnaroundTime: avgTurnaround,
        averageSlowdown: avgSlowdown,
        starvationIndex: maxWait,
      });

      return {
        ...prev,
        processes: nextProcesses,
        readyQueue: nextReadyQueue,
        runningProcessId: nextRunningId,
        terminatedProcessIds: nextTerminatedIds,
        currentTime: nextTime,
        quantumCounter: nextQuantumCounter,
        cpuBusyTime: nextCpuBusyTime,
        history: [...prev.history, nextRunningId],
      };
    });
  }, [algorithm, timeQuantum]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(tick, tickDuration);
    }
    return () => clearInterval(interval);
  }, [isPlaying, tick, tickDuration]);

  return {
    ...state,
    addProcess,
    reset,
    tick,
    isPlaying,
    setIsPlaying,
    algorithm,
    setAlgorithm,
    timeQuantum,
    setTimeQuantum,
    tickDuration,
    setTickDuration,
    metrics,
  };
};
