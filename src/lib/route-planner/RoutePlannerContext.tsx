"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Coordinate, TravelMode } from "@/lib/maps";

interface RoutePlannerContextType {
  selectedPandalIds: string[];
  travelMode: TravelMode;
  startOrigin: Coordinate | null;
  startOriginName: string;
  addStop: (pandalId: string) => void;
  removeStop: (pandalId: string) => void;
  moveStopUp: (index: number) => void;
  moveStopDown: (index: number) => void;
  reorderStops: (newOrder: string[]) => void;
  isInRoute: (pandalId: string) => boolean;
  clearRoute: () => void;
  setTravelMode: (mode: TravelMode) => void;
  setStartOrigin: (coord: Coordinate | null, name?: string) => void;
  getShareableRouteUrl: () => string;
  loadFromPandalIds: (ids: string[]) => void;
}

const RoutePlannerContext = createContext<RoutePlannerContextType | undefined>(
  undefined
);

const STORAGE_KEYS = {
  STOPS: "jd_route_stops",
  MODE: "jd_route_mode",
  START: "jd_route_start",
};

export function RoutePlannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedPandalIds, setSelectedPandalIds] = useState<string[]>([
    "pandal-chasapara-buri-maa",
    "pandal-krishnanagar-rajbari",
    "pandal-golapatti-barowari",
  ]);
  const [travelMode, setTravelModeState] = useState<TravelMode>("walking");
  const [startOrigin, setStartOriginState] = useState<Coordinate | null>(null);
  const [startOriginName, setStartOriginName] = useState<string>("");

  useEffect(() => {
    try {
      const savedStops = localStorage.getItem(STORAGE_KEYS.STOPS);
      if (savedStops) {
        setSelectedPandalIds(JSON.parse(savedStops));
      }
      const savedMode = localStorage.getItem(STORAGE_KEYS.MODE) as TravelMode | null;
      if (savedMode) {
        setTravelModeState(savedMode);
      }
      const savedStart = localStorage.getItem(STORAGE_KEYS.START);
      if (savedStart) {
        const parsed = JSON.parse(savedStart);
        setStartOriginState(parsed.coord);
        setStartOriginName(parsed.name || "");
      }
    } catch {
      // ignore
    }
  }, []);

  const saveStops = (stops: string[]) => {
    setSelectedPandalIds(stops);
    try {
      localStorage.setItem(STORAGE_KEYS.STOPS, JSON.stringify(stops));
    } catch {
      // ignore
    }
  };

  const addStop = (pandalId: string) => {
    if (!selectedPandalIds.includes(pandalId)) {
      saveStops([...selectedPandalIds, pandalId]);
    }
  };

  const removeStop = (pandalId: string) => {
    saveStops(selectedPandalIds.filter((id) => id !== pandalId));
  };

  const moveStopUp = (index: number) => {
    if (index <= 0 || index >= selectedPandalIds.length) return;
    const next = [...selectedPandalIds];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    saveStops(next);
  };

  const moveStopDown = (index: number) => {
    if (index < 0 || index >= selectedPandalIds.length - 1) return;
    const next = [...selectedPandalIds];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    saveStops(next);
  };

  const reorderStops = (newOrder: string[]) => {
    saveStops(newOrder);
  };

  const isInRoute = (pandalId: string) => selectedPandalIds.includes(pandalId);

  const clearRoute = () => {
    saveStops([]);
  };

  const setTravelMode = (mode: TravelMode) => {
    setTravelModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.MODE, mode);
    } catch {
      // ignore
    }
  };

  const setStartOrigin = (coord: Coordinate | null, name: string = "") => {
    setStartOriginState(coord);
    setStartOriginName(name);
    try {
      localStorage.setItem(
        STORAGE_KEYS.START,
        JSON.stringify({ coord, name })
      );
    } catch {
      // ignore
    }
  };

  const getShareableRouteUrl = () => {
    if (typeof window === "undefined") return "";
    const base = window.location.origin;
    const stopsParam = encodeURIComponent(selectedPandalIds.join(","));
    const modeParam = encodeURIComponent(travelMode);
    return `${base}/route-planner?stops=${stopsParam}&mode=${modeParam}`;
  };

  const loadFromPandalIds = (ids: string[]) => {
    if (ids && ids.length > 0) {
      saveStops(ids);
    }
  };

  return (
    <RoutePlannerContext.Provider
      value={{
        selectedPandalIds,
        travelMode,
        startOrigin,
        startOriginName,
        addStop,
        removeStop,
        moveStopUp,
        moveStopDown,
        reorderStops,
        isInRoute,
        clearRoute,
        setTravelMode,
        setStartOrigin,
        getShareableRouteUrl,
        loadFromPandalIds,
      }}
    >
      {children}
    </RoutePlannerContext.Provider>
  );
}

export function useRoutePlanner() {
  const context = useContext(RoutePlannerContext);
  if (!context) {
    throw new Error(
      "useRoutePlanner must be used within a RoutePlannerProvider"
    );
  }
  return context;
}

