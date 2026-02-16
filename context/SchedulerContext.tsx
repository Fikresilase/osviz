"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useScheduler } from "@/hooks/useScheduler";

type SchedulerContextType = ReturnType<typeof useScheduler>;

const SchedulerContext = createContext<SchedulerContextType | null>(null);

export const SchedulerProvider = ({ children }: { children: ReactNode }) => {
  const scheduler = useScheduler();
  return (
    <SchedulerContext.Provider value={scheduler}>
      {children}
    </SchedulerContext.Provider>
  );
};

export const useSchedulerContext = () => {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error(
      "useSchedulerContext must be used within a SchedulerProvider",
    );
  }
  return context;
};
