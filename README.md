# 🚀 OS-Viz v2.0

**OS-Viz** is a high-performance, interactive Operating System Process Scheduling Simulator. Designed with a premium aesthetic and modern tech stack, it provides an intuitive way to visualize and analyze complex CPU scheduling algorithms in real-time.

![Project Status](https://img.shields.io/badge/Status-Active-emerald)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20Framer%20Motion%20|%20Tailwind-blue)
![Environment](https://img.shields.io/badge/Runtime-Bun-f472b6)

---

## ✨ Key Features

### 🟦 Particle Dynamics Architecture

Processes are visualized as "particles" that physically transition between system states. Using **Framer Motion's** shared layout animations, you can watch a process move from the **Job Pool** to the **Ready Queue**, into the **CPU Core**, and finally into the **Terminated Archive**.

### ⚙️ Multi-Algorithm Engine

Switch between different scheduling strategies on the fly and observe how they affect system performance:

- **FCFS (First-Come, First-Served)**: Basic non-preemptive queueing.
- **SJF (Shortest Job First)**: Efficiency-focused scheduling with real-time queue re-ordering to minimize wait times. Includes a **Starvation Alert** system.
- **Round Robin (RR)**: Time-sliced fair scheduling with adjustable **Time Quantum** and preemption trackers.

### 📊 Deep Analytics Dashboard

A dedicated performance route (`/analytics`) providing:

- **Execution Timeline (Gantt Chart)**: A technical history track of exactly when each process occupied the CPU.
- **Metric Deep-Dives**: Real-time calculation of CPU Utilization, Average Waiting Time, Average Turnaround Time, and Throughput.
- **Process Breakdown**: A detailed audit log of every process's lifecyle (Arrival → Start → Finish).

### 🎨 State-of-the-Art UI

- **Glassmorphism Design**: Ultra-modern deep space theme with frosted-glass containers and neon glow effects.
- **High-End Componentry**: Rebuilt CPU Core with frequency waveforms and rotating "reactor" rings.
- **Projector Optimized**: High-contrast typography and bold color-coding for classroom presentations.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **State Management**: React Context (Shared simulation state across routes)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Runtime/PM**: [Bun](https://bun.sh/)

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your machine.

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/Fikresilase/osviz.git

# Navigate to the project folder
cd osviz

# Install dependencies
bun install
```

### 3. Run the Simulator

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start the simulation.

---

## 📂 Project Structure

```text
osviz/
├── app/                  # Next.js App Router (Pages & Layout)
│   ├── analytics/        # Dedicated Performance Analytics page
│   └── page.tsx          # Primary Simulation Command Center
├── components/           # UI Components
│   └── simulation/      # Core Simulation Modules (CPU, Queues, etc.)
├── context/              # SchedulerContext for global state sharing
├── hooks/                # useScheduler Engine (The core logic)
├── lib/                  # Utilities (cn, formatting)
├── types/                # TypeScript Interfaces
└── public/               # Static Assets
```

---

## 📖 Educational Context

This tool was built to bridge the gap between abstract scheduling theory and visual understanding.

- **Wait Time**: Calculated as `Turnaround Time - Burst Time`.
- **Turnaround Time**: Calculated as `Completion Time - Arrival Time`.
- **CPU Utilization**: The percentage of total simulation time the CPU spent executing tasks versus sitting idle.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you want to add more algorithms (like Priority Scheduling or MLFQ).

---

## 📄 License

MIT License. Free for educational and commercial use.
