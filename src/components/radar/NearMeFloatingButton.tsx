"use client";

import React from "react";
import { useRadar } from "@/lib/radar/RadarContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Compass } from "lucide-react";

export function NearMeFloatingButton() {
  const { openRadar, isRadarOpen } = useRadar();
  const { language } = useLanguage();

  if (isRadarOpen) return null;

  return (
    <div className="fixed bottom-[4.5rem] left-3 sm:bottom-6 sm:left-6 z-40">
      <button
        type="button"
        onClick={() => openRadar()}
        aria-label={
          language === "bn"
            ? "আমার আশেপাশে কি আছে দেখুন (রাডার)"
            : "Explore what's near me right now (Radar)"
        }
        className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#4a1810] via-[#5c1c13] to-[#8b2f1e] text-[#f5ba42] border border-[#d99b26]/50 shadow-lg shadow-black/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        {/* Pulsing radar ping indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5ba42] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f5ba42]" />
        </span>

        <Compass className="w-4 h-4 text-[#f5ba42] group-hover:rotate-45 transition-transform duration-300" />

        <div className="text-left font-bold text-xs sm:text-sm tracking-tight leading-tight">
          <span className="block text-white group-hover:text-[#f5ba42] transition-colors">
            {language === "bn" ? "আশেপাশে" : "Near Me"}
          </span>
        </div>
      </button>
    </div>
  );
}
