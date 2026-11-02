"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDataStore } from "@/lib/data/useDataStore";
import { InteractiveMap } from "@/components/map/InteractiveMap";

function MapPageContent() {
  const searchParams = useSearchParams();
  const initialPandalId = searchParams.get("pandal") || undefined;

  const { pandals, localities } = useDataStore();

  return (
    <div className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]">
      <InteractiveMap
        pandals={pandals}
        localities={localities}
        initialSelectedPandalId={initialPandalId}
      />
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] flex items-center justify-center bg-[#fcfaf5]">
          <div className="w-10 h-10 border-4 border-[#7a121d] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MapPageContent />
    </Suspense>
  );
}
