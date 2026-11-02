"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { dataStore } from "@/lib/data/store";
import { useRoutePlanner } from "@/lib/route-planner/RoutePlannerContext";
import { RoutePlannerView } from "@/components/route/RoutePlannerView";

function RoutePlannerContent() {
  const searchParams = useSearchParams();
  const { loadFromPandalIds, setTravelMode } = useRoutePlanner();

  const allPandals = dataStore.getPandals();
  const localities = dataStore.getLocalities();

  useEffect(() => {
    const stopsParam = searchParams.get("stops");
    if (stopsParam) {
      const ids = decodeURIComponent(stopsParam)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (ids.length > 0) {
        loadFromPandalIds(ids);
      }
    }

    const modeParam = searchParams.get("mode");
    if (modeParam === "walking" || modeParam === "driving") {
      setTravelMode(modeParam);
    }
  }, [searchParams, loadFromPandalIds, setTravelMode]);

  return <RoutePlannerView allPandals={allPandals} localities={localities} />;
}

export default function RoutePlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#8b2f1e] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RoutePlannerContent />
    </Suspense>
  );
}
