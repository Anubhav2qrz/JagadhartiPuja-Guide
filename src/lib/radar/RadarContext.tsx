"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Coordinate } from "@/lib/maps";

interface RadarContextType {
  isRadarOpen: boolean;
  openRadar: (initialCoord?: Coordinate | null) => void;
  closeRadar: () => void;
  radarInitialCoord: Coordinate | null;
}

const RadarContext = createContext<RadarContextType | undefined>(undefined);

export function RadarProvider({ children }: { children: React.ReactNode }) {
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [radarInitialCoord, setRadarInitialCoord] = useState<Coordinate | null>(null);

  const openRadar = useCallback((initialCoord?: Coordinate | null) => {
    if (initialCoord) {
      setRadarInitialCoord(initialCoord);
    }
    setIsRadarOpen(true);
  }, []);

  const closeRadar = useCallback(() => {
    setIsRadarOpen(false);
    setRadarInitialCoord(null);
  }, []);

  return (
    <RadarContext.Provider
      value={{
        isRadarOpen,
        openRadar,
        closeRadar,
        radarInitialCoord,
      }}
    >
      {children}
    </RadarContext.Provider>
  );
}

export function useRadar() {
  const context = useContext(RadarContext);
  if (!context) {
    throw new Error("useRadar must be used within a RadarProvider");
  }
  return context;
}
