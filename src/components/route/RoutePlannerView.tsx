"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Pandal, Locality } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRoutePlanner } from "@/lib/route-planner/RoutePlannerContext";
import {
  Coordinate,
  TravelMode,
  isValidCoordinate,
  chunkRouteForGoogleMaps,
  calculateHaversineDistanceKm,
} from "@/lib/maps";
import {
  Navigation,
  Footprints,
  Car,
  ArrowUp,
  ArrowDown,
  Trash2,
  Share2,
  Check,
  Plus,
  MapPin,
  Crosshair,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

interface RoutePlannerViewProps {
  allPandals: Pandal[];
  localities: Locality[];
}

export function RoutePlannerView({
  allPandals,
  localities,
}: RoutePlannerViewProps) {
  const { t, language } = useLanguage();
  const {
    selectedPandalIds,
    travelMode,
    startOrigin,
    startOriginName,
    removeStop,
    moveStopUp,
    moveStopDown,
    addStop,
    clearRoute,
    setTravelMode,
    setStartOrigin,
    getShareableRouteUrl,
  } = useRoutePlanner();

  const [copied, setCopied] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocalityFilter, setSelectedLocalityFilter] =
    useState<string>("all");

  // Map selected IDs to full Pandal objects, preserving the user's explicit order
  const orderedStops: Pandal[] = selectedPandalIds
    .map((id) => allPandals.find((p) => p.id === id))
    .filter((p): p is Pandal => Boolean(p));

  // Extract coordinates for verified stops
  const verifiedStopCoords: Coordinate[] = orderedStops
    .filter(
      (p) =>
        p.is_verified &&
        typeof p.latitude === "number" &&
        typeof p.longitude === "number" &&
        isValidCoordinate(p.latitude, p.longitude)
    )
    .map((p) => ({
      latitude: p.latitude as number,
      longitude: p.longitude as number,
    }));

  // Generate safe Google Maps segments
  const segments = chunkRouteForGoogleMaps(
    verifiedStopCoords,
    startOrigin,
    travelMode
  );

  // Calculate approximate straight-line hopping distance
  let totalDistanceKm = 0;
  if (verifiedStopCoords.length > 1) {
    let prev = startOrigin || verifiedStopCoords[0];
    const startIndex = startOrigin ? 0 : 1;
    for (let i = startIndex; i < verifiedStopCoords.length; i++) {
      const curr = verifiedStopCoords[i];
      totalDistanceKm += calculateHaversineDistanceKm(prev, curr);
      prev = curr;
    }
  }

  // Handle Geolocation for Starting Point
  const handleUseCurrentLocation = () => {
    setLocationError(null);
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation not supported by browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coord: Coordinate = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setStartOrigin(coord, t.routePlanner.currentLocation);
      },
      (err) => {
        setIsLocating(false);
        setLocationError(
          language === "bn"
            ? "লোকেশন পারমিশন পাওয়া যায়নি।"
            : "Location permission denied. Please select a custom starting point."
        );
      },
      { timeout: 7000 }
    );
  };

  const handleShareRoute = () => {
    const url = getShareableRouteUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Filter available pandals for quick-add list
  const availablePandals = allPandals.filter((p) => {
    if (selectedPandalIds.includes(p.id)) return false;
    if (
      selectedLocalityFilter !== "all" &&
      p.locality_id !== selectedLocalityFilter
    ) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName =
        p.name.toLowerCase().includes(q) ||
        (p.name_bn && p.name_bn.toLowerCase().includes(q));
      return matchName;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#ede4d1]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#7a121d] uppercase tracking-wider mb-1">
            <Route className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Krishnanagar Pandal Hopping</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#5e0c15]">
            {t.routePlanner.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#57534e] mt-1.5 max-w-2xl">
            {t.routePlanner.subtitle}
          </p>
        </div>

        {/* Global Route Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleShareRoute}
            disabled={selectedPandalIds.length === 0}
            className="px-3.5 py-2 rounded-xl border border-[#c59b27] bg-white hover:bg-stone-50 text-xs sm:text-sm font-semibold text-[#1c1917] flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">{t.actions.copied}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#7a121d]" />
                <span>{t.routePlanner.shareRoute}</span>
              </>
            )}
          </button>

          {selectedPandalIds.length > 0 && (
            <button
              onClick={clearRoute}
              className="p-2 rounded-xl text-stone-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
              title={t.routePlanner.clearRoute}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itinerary Stops & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Starting Point & Travel Mode Settings Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#ede4d1] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1c1917]">
              {language === "bn" ? "পরিক্রমার সূচনা ও মাধ্যম" : "Route Options & Origin"}
            </h3>

            {/* Travel Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#57534e] mr-1">
                {t.routePlanner.travelMode}:
              </span>
              <button
                type="button"
                onClick={() => setTravelMode("walking")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  travelMode === "walking"
                    ? "bg-[#7a121d] text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>{t.routePlanner.walking}</span>
              </button>
              <button
                type="button"
                onClick={() => setTravelMode("driving")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  travelMode === "driving"
                    ? "bg-[#7a121d] text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>{t.routePlanner.driving}</span>
              </button>
            </div>

            {/* Starting Point Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#57534e] mb-1.5">
                {t.routePlanner.startPoint}
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                    startOrigin
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200"
                  }`}
                >
                  <Crosshair
                    className={`w-3.5 h-3.5 text-emerald-700 ${
                      isLocating ? "animate-spin" : ""
                    }`}
                  />
                  <span>
                    {isLocating
                      ? t.hero.locating
                      : startOrigin
                      ? `${t.routePlanner.currentLocation} (Selected)`
                      : t.hero.useLocationBtn}
                  </span>
                </button>

                {startOrigin && (
                  <button
                    type="button"
                    onClick={() => setStartOrigin(null)}
                    className="text-xs text-rose-700 hover:underline px-2 py-1"
                  >
                    {language === "bn" ? "রিসেন্ট অরিজিন সরান" : "Remove origin"}
                  </button>
                )}
              </div>
              {locationError && (
                <p className="text-xs text-rose-600 mt-1.5">{locationError}</p>
              )}
            </div>
          </div>

          {/* Selected Itinerary Stops */}
          <div className="bg-white rounded-2xl p-5 border border-[#ede4d1] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                {t.routePlanner.selectedStops} ({orderedStops.length})
              </h3>
              {totalDistanceKm > 0 && (
                <span className="text-xs text-[#78716c] font-medium">
                  {t.routePlanner.approxDistance}: ~{totalDistanceKm} km
                </span>
              )}
            </div>

            {orderedStops.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-[#ede4d1] rounded-xl space-y-2">
                <MapPin className="w-8 h-8 text-[#c59b27] mx-auto opacity-75" />
                <h4 className="font-serif font-bold text-sm text-[#1c1917]">
                  {t.routePlanner.noStops}
                </h4>
                <p className="text-xs text-[#78716c] max-w-sm mx-auto">
                  {t.routePlanner.noStopsDesc}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderedStops.map((pandal, index) => {
                  const displayName =
                    language === "bn"
                      ? pandal.name_bn || pandal.name
                      : pandal.name;
                  const displayLocality =
                    language === "bn"
                      ? pandal.locality?.name_bn || pandal.locality?.name
                      : pandal.locality?.name;

                  return (
                    <div
                      key={pandal.id}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-[#ede4d1] bg-[#fcfaf5] hover:bg-stone-50 transition-all shadow-xs"
                    >
                      {/* Step Number Badge */}
                      <div className="w-7 h-7 rounded-full bg-[#5e0c15] text-[#e6be58] font-bold text-xs flex items-center justify-center shrink-0 border border-[#c59b27]/40 shadow-xs">
                        {index + 1}
                      </div>

                      {/* Thumbnail */}
                      <img
                        src={pandal.cover_image_url}
                        alt={displayName}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 bg-stone-200"
                      />

                      {/* Pandal Info */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#7a121d] uppercase tracking-wider truncate block">
                          {displayLocality}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#1c1917] truncate">
                          {displayName}
                        </h4>
                        {!pandal.is_verified && (
                          <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{t.status.unverified}</span>
                          </span>
                        )}
                      </div>

                      {/* Reorder Up/Down & Remove Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveStopUp(index)}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#ede4d1] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title={t.routePlanner.moveUp}
                          aria-label={`Move ${displayName} up`}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStopDown(index)}
                          disabled={index === orderedStops.length - 1}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#ede4d1] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title={t.routePlanner.moveDown}
                          aria-label={`Move ${displayName} down`}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStop(pandal.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                          title={t.routePlanner.remove}
                          aria-label={`Remove ${displayName} from route`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Google Maps Multi-Stop Launch Box */}
          {verifiedStopCoords.length > 0 && (
            <div className="bg-[#5e0c15] text-[#fcfaf5] rounded-2xl p-6 border border-[#c59b27]/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#fcfaf5]">
                    {language === "bn"
                      ? "গুগল ম্যাপসে সরাসরি নেভিগেশন"
                      : "Launch Direct Turn-by-Turn in Google Maps"}
                  </h3>
                  <p className="text-xs text-[#ede4d1]/80 mt-0.5">
                    {segments.length === 1
                      ? language === "bn"
                        ? "আপনার সম্পূর্ণ পরিক্রমা এক ক্লিকে গুগল ম্যাপসে খুলবে।"
                        : "Opens your entire multi-stop hopping route in Google Maps."
                      : t.routePlanner.segmentNotice}
                  </p>
                </div>
                <Navigation className="w-7 h-7 text-[#e6be58] shrink-0 hidden sm:block" />
              </div>

              {/* If Single Segment (<= 10 stops) */}
              {segments.length === 1 ? (
                <a
                  href={segments[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-action w-full py-3 px-5 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{t.routePlanner.openInGoogleMaps}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              ) : (
                /* Multi-Segment Buttons for > 10 stops */
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs bg-black/30 rounded-xl p-3 border border-white/10 text-[#ede4d1]">
                    {t.routePlanner.segmentNotice}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {segments.map((seg, sIdx) => (
                      <a
                        key={sIdx}
                        href={seg.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold-action py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>
                          {t.routePlanner.openSegment} {seg.segmentIndex} (Stops{" "}
                          {(seg.segmentIndex - 1) * 9 + 1}-
                          {Math.min(
                            seg.segmentIndex * 9,
                            verifiedStopCoords.length
                          )}
                          )
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Quick Add More Pandals (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#ede4d1] shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#1c1917] mb-1">
              {language === "bn" ? "আরও মণ্ডপ যুক্ত করুন" : "Add More Pandals"}
            </h3>
            <p className="text-xs text-[#78716c] mb-4">
              {language === "bn"
                ? "শহরের অন্যান্য বিখ্যাত মণ্ডপ সহজে আপনার পরিক্রমায় যুক্ত করুন।"
                : "Quickly select from verified Krishnanagar pandals to expand your route."}
            </p>

            {/* Quick Search & Locality Filter */}
            <div className="space-y-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.filters.searchPlaceholder}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#7a121d]"
              />
              <select
                value={selectedLocalityFilter}
                onChange={(e) => setSelectedLocalityFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none"
              >
                <option value="all">{t.filters.allLocalities}</option>
                {localities.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {language === "bn" ? loc.name_bn : loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Available List */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {availablePandals.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center">
                  {language === "bn"
                    ? "সব মণ্ডপ ইতিমধ্যে যুক্ত করা হয়েছে।"
                    : "All matching pandals have been added to your route."}
                </p>
              ) : (
                availablePandals.map((pandal) => {
                  const displayName =
                    language === "bn"
                      ? pandal.name_bn || pandal.name
                      : pandal.name;
                  const displayLocality =
                    language === "bn"
                      ? pandal.locality?.name_bn || pandal.locality?.name
                      : pandal.locality?.name;

                  return (
                    <div
                      key={pandal.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-stone-100 hover:bg-[#fcfaf5] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={pandal.cover_image_url}
                          alt={displayName}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 bg-stone-200"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-[#7a121d] font-bold block truncate">
                            {displayLocality}
                          </span>
                          <h4 className="font-serif font-bold text-xs text-[#1c1917] truncate">
                            {displayName}
                          </h4>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => addStop(pandal.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-[#7a121d] hover:text-white transition-colors flex items-center gap-1 shrink-0 cursor-pointer text-[#5e0c15]"
                        title={t.actions.addToRoute}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{language === "bn" ? "যোগ" : "Add"}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

