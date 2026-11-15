"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface ChecklistContextType {
  visitedPandalIds: string[];
  isVisited: (id: string) => boolean;
  toggleVisited: (id: string) => boolean;
  markVisited: (id: string) => void;
  unmarkVisited: (id: string) => void;
  clearVisited: () => void;
  visitedCount: number;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

const STORAGE_KEY = "jd_visited_pandals_v1";

export function ChecklistProvider({ children }: { children: React.ReactNode }) {
  const [visitedPandalIds, setVisitedPandalIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setVisitedPandalIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = (ids: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  };

  const isVisited = useCallback(
    (id: string) => visitedPandalIds.includes(id),
    [visitedPandalIds]
  );

  const toggleVisited = useCallback((id: string): boolean => {
    let nowVisited = false;
    setVisitedPandalIds((prev) => {
      const exists = prev.includes(id);
      nowVisited = !exists;
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      saveToStorage(next);
      return next;
    });
    return nowVisited;
  }, []);

  const markVisited = useCallback((id: string) => {
    setVisitedPandalIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveToStorage(next);
      return next;
    });
  }, []);

  const unmarkVisited = useCallback((id: string) => {
    setVisitedPandalIds((prev) => {
      if (!prev.includes(id)) return prev;
      const next = prev.filter((item) => item !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearVisited = useCallback(() => {
    setVisitedPandalIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <ChecklistContext.Provider
      value={{
        visitedPandalIds,
        isVisited,
        toggleVisited,
        markVisited,
        unmarkVisited,
        clearVisited,
        visitedCount: visitedPandalIds.length,
      }}
    >
      {children}
    </ChecklistContext.Provider>
  );
}

export function useChecklist() {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error("useChecklist must be used within a ChecklistProvider");
  }
  return context;
}

