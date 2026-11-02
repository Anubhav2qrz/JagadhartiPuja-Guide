"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  getGoogleMapsDirectionsUrl,
  isValidCoordinate,
  Coordinate,
  TravelMode,
} from "@/lib/maps";
import { Navigation, AlertTriangle, Footprints, Car } from "lucide-react";

interface NavigateButtonProps {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  isVerified: boolean;
  pandalName?: string;
  defaultTravelMode?: TravelMode;
  className?: string;
  showModeSelector?: boolean;
  variant?: "primary" | "compact" | "secondary";
}

export function NavigateButton({
  latitude,
  longitude,
  isVerified,
  pandalName,
  defaultTravelMode = "walking",
  className = "",
  showModeSelector = false,
  variant = "primary",
}: NavigateButtonProps) {
  const { t, language } = useLanguage();
  const [travelMode, setTravelMode] = useState<TravelMode>(defaultTravelMode);
  const [isLocating, setIsLocating] = useState(false);

  const hasValidCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    isValidCoordinate(latitude, longitude);

  const isNavigationAllowed = isVerified && hasValidCoords;

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isNavigationAllowed || latitude == null || longitude == null) {
      return;
    }

    // Attempt to acquire origin from browser geolocation if user has granted it,
    // or quickly generate URL and open Google Maps which handles origin automatically.
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const origin: Coordinate = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          const url = getGoogleMapsDirectionsUrl({
            destination: { latitude, longitude },
            origin,
            travelMode,
          });
          window.open(url, "_blank", "noopener,noreferrer");
        },
        () => {
          // If denied, timed out, or unavailable, Google Maps will determine origin
          setIsLocating(false);
          const url = getGoogleMapsDirectionsUrl({
            destination: { latitude, longitude },
            travelMode,
          });
          window.open(url, "_blank", "noopener,noreferrer");
        },
        { timeout: 3500, enableHighAccuracy: false }
      );
    } else {
      const url = getGoogleMapsDirectionsUrl({
        destination: { latitude, longitude },
        travelMode,
      });
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (!isNavigationAllowed) {
    return (
      <div className={`relative group ${className}`}>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 text-stone-400 border border-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed opacity-75"
          title={t.status.unverifiedNotice}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">
            {language === "bn"
              ? "নেভিগেশন স্থগিত (যাচাই প্রয়োজন)"
              : "Navigation Disabled (Unverified)"}
          </span>
        </button>
        <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-stone-900 text-stone-100 text-[11px] rounded-lg shadow-lg z-30 text-center pointer-events-none">
          {t.status.unverifiedNotice}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleNavigate}
          disabled={isLocating}
          className={`flex-1 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-all min-h-11 ${
            variant === "primary"
              ? "btn-maroon-action px-4 py-2.5"
              : "bg-[#f7f3e8] hover:bg-[#ede4d1] text-[#5e0c15] border border-[#c59b27]/50 px-3 py-2"
          }`}
          title={`${t.actions.navigateGoogleMaps} ${pandalName ? `(${pandalName})` : ""}`}
        >
          <Navigation className="w-4 h-4 text-[#e6be58] shrink-0" />
          <span className="font-semibold tracking-tight">
            {isLocating ? "..." : t.actions.navigateGoogleMaps}
          </span>
        </button>

        {showModeSelector && (
          <div className="flex items-center bg-[#ede4d1]/70 rounded-xl p-1 border border-[#c59b27]/30 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTravelMode("walking");
              }}
              className={`p-2 rounded-lg text-xs transition-colors ${
                travelMode === "walking"
                  ? "bg-[#7a121d] text-white shadow-xs"
                  : "text-[#57534e] hover:text-[#1c1917]"
              }`}
              title={t.routePlanner.walking}
              aria-label={t.routePlanner.walking}
            >
              <Footprints className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTravelMode("driving");
              }}
              className={`p-2 rounded-lg text-xs transition-colors ${
                travelMode === "driving"
                  ? "bg-[#7a121d] text-white shadow-xs"
                  : "text-[#57534e] hover:text-[#1c1917]"
              }`}
              title={t.routePlanner.driving}
              aria-label={t.routePlanner.driving}
            >
              <Car className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

