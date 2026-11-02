"use client";

import dynamic from "next/dynamic";
import { Pandal, Locality } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";

interface InteractiveMapProps {
  pandals: Pandal[];
  localities: Locality[];
  initialSelectedPandalId?: string;
}

const DynamicMap = dynamic(
  () => import("./InteractiveMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-[#ede4d1]/30 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#7a121d] border-t-transparent rounded-full animate-spin" />
        <div className="space-y-1">
          <p className="font-serif font-bold text-lg text-[#5e0c15]">
            Loading Krishnanagar Interactive Map...
          </p>
          <p className="text-xs text-[#78716c]">
            Loading OpenStreetMap tiles and verified pandal markers.
          </p>
        </div>
      </div>
    ),
  }
);

export function InteractiveMap(props: InteractiveMapProps) {
  return <DynamicMap {...props} />;
}

