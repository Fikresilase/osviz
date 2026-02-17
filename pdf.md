# OS-Viz: A High-Fidelity Simulation Framework for Process Scheduling Analysis

**Operating Systems (Module A) — Project Report**

---

## Project Metadata

- **Student**: Shaloma Jayasuriyakurnage Perera (Matricola: 562485)
- **Institution**: University of Messina, MIFT Department
- **Supervising Faculty**: Prof. Maria Fazio
- **Evaluation Faculty**: Prof. Maurizio Giacobbe

---

## Abstract

Operating System (OS) CPU scheduling is a fundamental concept in computer science that often remains abstract and difficult for students to visualize. **OS-Viz** is a technical framework designed to bridge this cognitive gap by providing a real-time, high-fidelity simulation environment. This report explores the architectural decisions, technological motivations, and engineering implementation of the OS-Viz platform, highlighting how modern web technologies can be leveraged to create sophisticated educational tools.

---

## 1. Introduction & Project Evolution

Process scheduling is at the core of multitasking operating systems. Understanding how a kernel selects which process to execute—considering factors like throughput, latency, and fairness—requires more than static diagrams.

### 1.1 From Terminal to Interactive Dashboard

The initial proposal for this project was a terminal-based Python script. However, following the guidance of **Prof. Maurizio Giacobbe**, the scope was expanded significantly. The current implementation, **OS-Viz**, pivotally integrates the requested performance metrics—**Throughput**, **Starvation**, and **Slowdown**—into a visual, state-of-the-art interface. This transition ensures that the simulator is not just a calculation tool, but a comprehensive educational platform that demonstrates the physical dynamics of process scheduling.

**OS-Viz** allows users to:

1.  Inject processes into a dynamic lifecycle.
2.  Observe real-time state transitions (New → Ready → Running → Terminated).
3.  Switch between fundamental scheduling algorithms (FCFS, SJF, RR) dynamically.
4.  Analyze high-level performance metrics including response time and slowdown ratios.

[IMAGE: Placeholder - Main Dashboard Overview showing the CPU Core and Process Queues]

---

## 2. Technical Motivation & Technology Stack

The development of OS-Viz was driven by a requirement for high performance, visual fluidity, and strict architectural integrity. The following technologies were selected to fulfill these criteria:

### 2.1 Next.js 15 & Bun Runtime

Transitioning from Python to **Next.js 15** (App Router) ensured a production-grade foundation. By utilizing React 19’s latest features and the **Bun** runtime, OS-Viz achieves sub-millisecond execution speeds for simulation logic, ensuring that the "clock ticks" of the virtual CPU are consistent and precise.

### 2.2 Framer Motion: Particle Dynamics Architecture

Traditional simulators often use static table updates. OS-Viz implements a **Particle Dynamics Architecture** using **Framer Motion**. Each process is treated as a physical entity with a `layoutId`, allowing the browser to animate its transition between the Job Pool, Ready Queue, and CPU Core. This visual continuity mimics the physical movement of data through system registers.

### 2.3 Tailwind CSS 4.0 & Glassmorphism

To maintain a professional, high-end "Command Center" aesthetic, **Tailwind CSS 4.0** was utilized. The design system leverages:

- **Glassmorphism**: Frosted-glass overlays to maintain depth.
- **Neon Glow Effects**: Real-time color mapping based on process state.
- **High-Contrast Typography**: Optimized for classroom projectors.

---

## 3. Engineering & Development Decisions

### 3.1 Advanced Metrics Implementation

Following the academic requirements set by Prof. Giacobbe, the telemetry engine was expanded to include:

- **Throughput**: Calculated as $\frac{\text{Completed Processes}}{\text{Total Simulation Ticks}}$.
- **Starvation Index**: A real-time monitor of the maximum waiting time experienced by any process in the ready queue.
- **Slowdown (Normalized TAT)**: The ratio $\frac{\text{Turnaround Time}}{\text{Burst Time}}$, providing an index of how much delay a process experienced relative to its execution size.

### 3.2 The Atomic State Model

A critical decision was the implementation of a **Single Source of Truth** for the simulation state.

- **Benefit**: Ensures that every render cycle is consistent.
- **Implementation**: The `useScheduler` hook performs atomic updates during each "tick," preventing race conditions where a process might appear in two places simultaneously.

[IMAGE: Placeholder - Architecture Diagram showing the State Flow from Hook to Components]

### 3.3 Modular Algorithm Dispatcher

The dispatcher uses a **Strategy Pattern** to inject algorithms:

- **FCFS**: Absolute arrival-time priority.
- **SJF**: Shortest-burst priority with real-time queue re-sorting.
- **Round Robin**: Time-quantum-based preemption with a dedicated quantum counter.

---

## 4. Implementation Deep-Dive

### 4.1 The "Tick" Lifecycle

The heartbeat of the system is the `tick` function. Every 1000ms (adjustable), the system evaluates:

1.  **Arrivals**: Moving "New" processes to the "Ready" queue.
2.  **Execution**: Decrementing the `remainingTime` of the running process.
3.  **Preemption**: Checking if the time quantum has expired (RR) or if a process has finished.
4.  **Dispatching**: Selecting the next process based on the active algorithm.

### 4.2 The CPU "Reactor" Component

The CPU is visualized as a central "Reactor" ring. Using SVG animations, the core physically reacts to the process it is currently "burning." When idle, the animation slows to a "pulse," providing immediate visual feedback on system utilization.

[IMAGE: Placeholder - Close-up of the CPU Reactor with process P1 currently executing]

---

## 5. Educational Impact & Conclusion

OS-Viz transforms the study of Operating Systems from an exercise in manual calculation to an immersive, data-driven experience. By combining high-end web aesthetics with rigorous engineering principles, the tool provides a platform for deep experimentation.

**OS-Viz** stands as a testament to the power of modern interactive design in technical education at the **University of Messina**.

---

**Developed by**: Shaloma Jayasuriyakurnage Perera (ID: 562485)
**Project Repository**: [GitHub Link Placeholder]
