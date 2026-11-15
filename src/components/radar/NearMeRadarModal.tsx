"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRadar } from "@/lib/radar/RadarContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useDataStore } from "@/lib/data/useDataStore";
import { useRoutePlanner } from "@/lib/route-planner/RoutePlannerContext";
import { useChecklist } from "@/lib/checklist/ChecklistContext";
import { Coordinate, calculateHaversineDistanceKm } from "@/lib/maps";
import { NavigateButton } from "@/components/navigation/NavigateButton";
import {
  Compass,
  X,
  Crosshair,
  MapPin,
  Clock,
  Car,
  Check,
  Plus,
  Zap,
  Coffee,
  HeartPulse,
  Navigation,
  Sparkles,
} from "lucide-react";

interface LandmarkedOrigin {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  coord: Coordinate;
}

const LANDMARKS: LandmarkedOrigin[] = [
  {
    id: "station",
    name: "Krishnanagar Station",
    nameBn: "কৃষ্ণনগর স্টেশন",
    icon: "🚆",
    coord: { latitude: 23.3948, longitude: 88.512 },
  },
  {
    id: "rajbari",
    name: "Krishnanagar Rajbari",
    nameBn: "রাজবাড়ি ময়দান",
    icon: "👑",
    coord: { latitude: 23.403, longitude: 88.4938 },
  },
  {
    id: "chasapara",
    name: "Chasapara (Buri Maa)",
    nameBn: "চাষাপাড়া (বুড়িমা)",
    icon: "🌺",
    coord: { latitude: 23.410188, longitude: 88.496313 },
  },
  {
    id: "postoffice",
    name: "Post Office More",
    nameBn: "পোস্ট অফিস মোড়",
    icon: "📮",
    coord: { latitude: 23.4042, longitude: 88.4985 },
  },
];

export function NearMeRadarModal() {
  const { isRadarOpen, closeRadar, radarInitialCoord } = useRadar();
  const { language } = useLanguage();
  const { pandals, places } = useDataStore();
  const { addStop, isInRoute, loadFromPandalIds, setStartOrigin } = useRoutePlanner();
  const { isVisited, toggleVisited } = useChecklist();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<"pandals" | "parking" | "emergency" | "sweets">("pandals");
  const [currentCoord, setCurrentCoord] = useState<Coordinate | null>(null);
  const [locationSource, setLocationSource] = useState<"gps" | "landmark">("gps");
  const [activeLandmarkId, setActiveLandmarkId] = useState<string>("station");
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Request GPS position
  const requestGPS = () => {
    if (!("geolocation" in navigator)) {
      setGpsError(language === "bn" ? "ব্রাউজারে জিপিএস সমর্থিত নয়।" : "Geolocation not supported.");
      fallbackToLandmark("station");
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setCurrentCoord({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationSource("gps");
      },
      () => {
        setIsLocating(false);
        setGpsError(
          language === "bn"
            ? "জিপিএস অন করা যায়নি; নিকটবর্তী ল্যান্ডমার্ক ব্যবহার করা হচ্ছে।"
            : "Location access denied; defaulted to nearest landmark."
        );
        fallbackToLandmark("station");
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  const fallbackToLandmark = (landmarkId: string) => {
    const lm = LANDMARKS.find((l) => l.id === landmarkId) || LANDMARKS[0];
    setCurrentCoord(lm.coord);
    setLocationSource("landmark");
    setActiveLandmarkId(lm.id);
  };

  // Trigger GPS on modal open if no initial coord provided
  useEffect(() => {
    if (isRadarOpen) {
      if (radarInitialCoord) {
        setCurrentCoord(radarInitialCoord);
        setLocationSource("gps");
      } else {
        requestGPS();
      }
    }
  }, [isRadarOpen, radarInitialCoord]);

  // Format distance
  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  };

  // Calculate estimated walk time
  const formatWalkTime = (km: number) => {
    const mins = Math.max(1, Math.round(km * 12)); // ~5 km/h walking speed
    return language === "bn" ? `~${mins} মিনিট হাঁটা` : `~${mins} min walk`;
  };

  // Computed & Sorted Pandals by Distance
  const sortedPandals = useMemo(() => {
    if (!currentCoord) return [];
    return pandals
      .filter((p) => typeof p.latitude === "number" && typeof p.longitude === "number")
      .map((p) => {
        const distKm = calculateHaversineDistanceKm(currentCoord, {
          latitude: p.latitude as number,
          longitude: p.longitude as number,
        });
        return { ...p, distKm };
      })
      .sort((a, b) => a.distKm - b.distKm);
  }, [pandals, currentCoord]);

  // Computed & Sorted Places (Parking, First Aid, Food)
  const sortedPlaces = useMemo(() => {
    if (!currentCoord) return [];
    return places
      .filter((pl) => typeof pl.latitude === "number" && typeof pl.longitude === "number")
      .map((pl) => {
        const distKm = calculateHaversineDistanceKm(currentCoord, {
          latitude: pl.latitude as number,
          longitude: pl.longitude as number,
        });
        return { ...pl, distKm };
      })
      .sort((a, b) => a.distKm - b.distKm);
  }, [places, currentCoord]);

  const nearestParking = sortedPlaces.filter((p) => p.category === "parking");
  const nearestEmergency = sortedPlaces.filter(
    (p) => p.category === "first_aid" || p.category === "restroom" || p.category === "water"
  );
  const nearestSweets = sortedPlaces.filter(
    (p) => p.category === "sweet_shop" || p.category === "restaurant" || p.category === "cafe"
  );

  // Auto-Route 5 Nearest Action
  const handleAutoRouteNearestFive = () => {
    const topFiveIds = sortedPandals.slice(0, 5).map((p) => p.id);
    if (topFiveIds.length > 0 && currentCoord) {
      loadFromPandalIds(topFiveIds);
      setStartOrigin(
        currentCoord,
        locationSource === "gps"
          ? language === "bn"
            ? "আমার জিপিএস অবস্থান"
            : "My GPS Location"
          : LANDMARKS.find((l) => l.id === activeLandmarkId)?.name || "Krishnanagar"
      );
      closeRadar();
      router.push("/route-planner");
    }
  };

  if (!isRadarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fcfaf5] w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#ede4d1] max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header Bar */}
        <div className="bg-linear-to-r from-[#4a1810] via-[#5c1c13] to-[#4a1810] text-[#fcfaf5] p-4 sm:p-5 flex items-center justify-between border-b border-[#d99b26]/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#d99b26] text-[#1c1917] flex items-center justify-center shadow-inner">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#f5ba42]">
                  {language === "bn" ? "আমার আশেপাশে — কুইক রাডার" : "Near Me Right Now — Live Radar"}
                </h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5ba42] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d99b26]"></span>
                </span>
              </div>
              <p className="text-[11px] text-[#ede4d1]/80">
                {language === "bn"
                  ? "নিকটবর্তী মণ্ডপ, পার্কিং, মিষ্টির দোকান ও জরুরি পরিষেবা"
                  : "Instant walking radar for closest pandals, parking & essentials"}
              </p>
            </div>
          </div>

          <button
            onClick={closeRadar}
            className="p-2 rounded-full text-[#ede4d1] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close radar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location Origin Status Bar */}
        <div className="bg-[#ede4d1]/40 border-b border-[#ede4d1] px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Crosshair className={`w-3.5 h-3.5 text-[#8b2f1e] ${isLocating ? "animate-spin" : ""}`} />
            <span className="font-semibold text-stone-700">
              {isLocating
                ? language === "bn"
                  ? "জিপিএস অবস্থান চিহ্নিত হচ্ছে..."
                  : "Scanning live GPS location..."
                : locationSource === "gps"
                ? language === "bn"
                  ? "লাইভ জিপিএস অবস্থান সক্রিয়"
                  : "Live GPS Position Active"
                : `${language === "bn" ? "কেন্দ্রবিন্দু:" : "From:"} ${
                    LANDMARKS.find((l) => l.id === activeLandmarkId)?.[
                      language === "bn" ? "nameBn" : "name"
                    ]
                  }`}
            </span>
          </div>

          {/* Quick Landmark Switchers */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={requestGPS}
              disabled={isLocating}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                locationSource === "gps"
                  ? "bg-[#4a1810] text-[#f5ba42] shadow-xs"
                  : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              <span>📍 {language === "bn" ? "জিপিএস" : "GPS"}</span>
            </button>
            {LANDMARKS.map((lm) => (
              <button
                key={lm.id}
                type="button"
                onClick={() => fallbackToLandmark(lm.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  locationSource === "landmark" && activeLandmarkId === lm.id
                    ? "bg-[#4a1810] text-[#f5ba42] font-bold shadow-xs"
                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                }`}
              >
                <span>{lm.icon} {language === "bn" ? lm.nameBn : lm.name}</span>
              </button>
            ))}
          </div>
        </div>

        {gpsError && (
          <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 font-medium">
            {gpsError}
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center border-b border-[#ede4d1] bg-white px-3 pt-2 gap-1 overflow-x-auto shrink-0 scrollbar-none">
          {[
            {
              id: "pandals",
              label: language === "bn" ? "🛕 নিকটবর্তী মণ্ডপ" : "🛕 Pandals",
              count: sortedPandals.length,
            },
            {
              id: "parking",
              label: language === "bn" ? "🅿️ পার্কিং জোন" : "🅿️ Parking",
              count: nearestParking.length,
            },
            {
              id: "emergency",
              label: language === "bn" ? "🏥 জরুরি ও টয়লেট" : "🏥 First Aid & Restrooms",
              count: nearestEmergency.length,
            },
            {
              id: "sweets",
              label: language === "bn" ? "🍬 সরপুরিয়া ও মিষ্টি" : "🍬 Sweets & Food",
              count: nearestSweets.length,
            },
          ].map((tab) => {
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? "border-[#8b2f1e] text-[#8b2f1e] bg-[#fcfaf5]"
                    : "border-transparent text-stone-600 hover:text-stone-900"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded-full">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Body List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {/* TAB 1: PANDALS */}
          {activeCategory === "pandals" && (
            <div className="space-y-3">
              {/* Quick Auto-Route 5 Nearest Callout */}
              {sortedPandals.length >= 3 && (
                <button
                  type="button"
                  onClick={handleAutoRouteNearestFive}
                  className="w-full p-3 rounded-2xl bg-linear-to-r from-[#d99b26] to-[#f5ba42] text-[#1c1917] font-bold text-xs sm:text-sm flex items-center justify-between gap-2 shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 fill-current shrink-0" />
                    <span>
                      {language === "bn"
                        ? "⚡ নিকটবর্তী ৫টি মণ্ডপের শর্টকাট রুট তৈরি করুন"
                        : "⚡ Auto-Route 5 Closest Pandals from Here"}
                    </span>
                  </div>
                  <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full shrink-0">
                    {language === "bn" ? "পরিক্রমা শুরু করুন" : "Start Tour →"}
                  </span>
                </button>
              )}

              {sortedPandals.slice(0, 10).map((pandal, idx) => {
                const displayName = language === "bn" ? pandal.name_bn || pandal.name : pandal.name;
                const displayLocality =
                  language === "bn" ? pandal.locality?.name_bn || pandal.locality?.name : pandal.locality?.name;
                const visited = isVisited(pandal.id);
                const inRoute = isInRoute(pandal.id);

                return (
                  <div
                    key={pandal.id}
                    className={`bg-white rounded-2xl p-3.5 border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      visited ? "border-emerald-300 ring-1 ring-emerald-500/20" : "border-[#ede4d1]"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Rank Index / Image */}
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <img
                          src={pandal.cover_image_url || "https://upload.wikimedia.org/wikipedia/commons/2/2a/Burima%2C_Krishnanagar.jpg"}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                          #{idx + 1}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-bold text-[#8b2f1e]">
                            {displayLocality}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                            {formatDistance(pandal.distKm)}
                          </span>
                          <span className="text-[10px] text-stone-500 flex items-center gap-0.5">
                            <Clock className="w-3 h-3 text-[#d99b26]" />
                            {formatWalkTime(pandal.distKm)}
                          </span>
                        </div>

                        <Link
                          href={`/pandals/${pandal.slug}`}
                          onClick={closeRadar}
                          className="font-serif font-bold text-sm sm:text-base text-[#1c1917] hover:text-[#8b2f1e] transition-colors truncate block"
                        >
                          {displayName}
                        </Link>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {/* Visited Checkmark */}
                      <button
                        type="button"
                        onClick={() => toggleVisited(pandal.id)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          visited
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                        title={visited ? "Visited" : "Mark Visited"}
                      >
                        <Check className={`w-3.5 h-3.5 ${visited ? "stroke-[3]" : ""}`} />
                        <span className="hidden sm:inline">
                          {visited ? (language === "bn" ? "দর্শন সম্পন্ন" : "Visited") : (language === "bn" ? "দর্শন" : "Check-in")}
                        </span>
                      </button>

                      {/* Add to Route */}
                      <button
                        type="button"
                        onClick={() => addStop(pandal.id)}
                        disabled={inRoute}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          inRoute
                            ? "bg-amber-50 text-amber-900 border-amber-300 opacity-60"
                            : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                        }`}
                        title="Add to custom route"
                      >
                        {inRoute ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Plus className="w-3.5 h-3.5 text-[#8b2f1e]" />}
                        <span className="hidden sm:inline">{inRoute ? "In Route" : "+ Route"}</span>
                      </button>

                      {/* Direct Turn-by-Turn Navigation */}
                      <NavigateButton
                        latitude={pandal.latitude}
                        longitude={pandal.longitude}
                        isVerified={pandal.is_verified}
                        pandalName={displayName}
                        className="py-1.5 px-3 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: PARKING */}
          {activeCategory === "parking" && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2">
                <Car className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p>
                  {language === "bn"
                    ? "নদিয়া জেলা ট্রাফিক পুলিশ নির্দেশিত অফিসিয়াল পুজো পার্কিং জোন। ভিড়ের রাতে কেন্দ্রে প্রবেশের আগে এখানে গাড়ি বা টোটো পার্ক করুন।"
                    : "Official parking areas designated by Krishnanagar Traffic Police. Recommended to park before entering pedestrian festival corridors."}
                </p>
              </div>

              {nearestParking.map((place) => {
                const displayName = language === "bn" ? place.name_bn || place.name : place.name;
                const displayAddress = language === "bn" ? place.address_bn || place.address : place.address;
                const displayDesc = language === "bn" ? place.description_bn || place.description : place.description;

                return (
                  <div
                    key={place.id}
                    className="bg-white rounded-2xl p-4 border border-[#ede4d1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-200">
                          {language === "bn" ? "পার্কিং জোন" : "Parking Area"}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {formatDistance(place.distKm)}
                        </span>
                        <span className="text-xs text-stone-500">
                          {formatWalkTime(place.distKm)}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#1c1917]">
                        {displayName}
                      </h4>
                      <p className="text-xs text-[#8b2f1e] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{displayAddress}</span>
                      </p>
                      <p className="text-xs text-[#57534e] mt-1.5 leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>

                    <div className="shrink-0 self-end sm:self-auto">
                      <NavigateButton
                        latitude={place.latitude}
                        longitude={place.longitude}
                        isVerified={place.is_verified}
                        pandalName={displayName}
                        showModeSelector={true}
                        className="py-2 px-4 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: EMERGENCY & FIRST AID */}
          {activeCategory === "emergency" && (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p>
                  {language === "bn"
                    ? "জরুরি চিকিৎসা সহায়তা, অ্যাম্বুলেন্স ও সার্বক্ষণিক ট্রমা সেন্টার। জরুরি ডায়াল: ১০২ বা ০৩৪৭২-২৫২৩২৪।"
                    : "24/7 medical trauma facilities, first-aid centers & ambulances. Direct dial 102 or Nadia District Hospital (03472-252324)."}
                </p>
              </div>

              {nearestEmergency.map((place) => {
                const displayName = language === "bn" ? place.name_bn || place.name : place.name;
                const displayAddress = language === "bn" ? place.address_bn || place.address : place.address;
                const displayDesc = language === "bn" ? place.description_bn || place.description : place.description;

                return (
                  <div
                    key={place.id}
                    className="bg-white rounded-2xl p-4 border border-[#ede4d1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full border border-rose-200">
                          {place.category === "first_aid" ? "24/7 First Aid" : "Restroom / Water"}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {formatDistance(place.distKm)}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#1c1917]">
                        {displayName}
                      </h4>
                      <p className="text-xs text-[#8b2f1e] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{displayAddress}</span>
                      </p>
                      <p className="text-xs text-[#57534e] mt-1.5 leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>

                    <div className="shrink-0 self-end sm:self-auto">
                      <NavigateButton
                        latitude={place.latitude}
                        longitude={place.longitude}
                        isVerified={place.is_verified}
                        pandalName={displayName}
                        showModeSelector={true}
                        className="py-2 px-4 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: SWEETS & FOOD */}
          {activeCategory === "sweets" && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
                <Coffee className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  {language === "bn"
                    ? "কৃষ্ণনগরের ঐতিহ্যবাহী সরপুরিয়া ও সরভাজার আদি মিষ্টির দোকান এবং জনপ্রিয় রেস্তোরাঁ।"
                    : "Authentic, historic makers of Krishnanagar's GI-tagged Sarpuria and Sarbhaja sweetmeats."}
                </p>
              </div>

              {nearestSweets.map((place) => {
                const displayName = language === "bn" ? place.name_bn || place.name : place.name;
                const displayAddress = language === "bn" ? place.address_bn || place.address : place.address;
                const displayDesc = language === "bn" ? place.description_bn || place.description : place.description;

                return (
                  <div
                    key={place.id}
                    className="bg-white rounded-2xl p-4 border border-[#ede4d1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                          {place.category === "sweet_shop" ? "Authentic Sweets" : "Food / Dining"}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {formatDistance(place.distKm)}
                        </span>
                        <span className="text-xs text-stone-500">
                          {formatWalkTime(place.distKm)}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#1c1917]">
                        {displayName}
                      </h4>
                      <p className="text-xs text-[#8b2f1e] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{displayAddress}</span>
                      </p>
                      <p className="text-xs text-[#57534e] mt-1.5 leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>

                    <div className="shrink-0 self-end sm:self-auto">
                      <NavigateButton
                        latitude={place.latitude}
                        longitude={place.longitude}
                        isVerified={place.is_verified}
                        pandalName={displayName}
                        showModeSelector={true}
                        className="py-2 px-4 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-3 bg-[#ede4d1]/30 border-t border-[#ede4d1] flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>
            {language === "bn"
              ? "কৃষ্ণনগরের ভৌগোলিক দূরত্বের ভিত্তিতে তালিকাভুক্ত"
              : "Calculated via verified Krishnanagar coordinates"}
          </span>
          <button
            type="button"
            onClick={closeRadar}
            className="font-bold text-[#8b2f1e] hover:underline cursor-pointer"
          >
            {language === "bn" ? "বন্ধ করুন" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
