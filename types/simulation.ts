export type ProcessState = "NEW" | "READY" | "RUNNING" | "TERMINATED";

export interface Process {
  id: number;
  color: string; // Hex code for visual distinction
  arrivalTime: number;
  burstTime: number;
  remainingTime: number;
  state: ProcessState;
  startTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
}

export interface SchedulerMetrics {
  totalTime: number;
  cpuUtilization: number;
  completedProcesses: number;
  averageWaitTime: number;
  averageTurnaroundTime: number;
}

export type AlgorithmType = "FCFS" | "SJF" | "RR";

export interface SchedulerState {
  processes: Process[];
  readyQueue: number[]; // Process IDs in order
  runningProcessId: number | null;
  terminatedProcessIds: number[];
  currentTime: number;
  algorithm: AlgorithmType;
  timeQuantum: number; // For RR
  isPlaying: boolean;
  tickDuration: number;
  metrics: SchedulerMetrics;
}
