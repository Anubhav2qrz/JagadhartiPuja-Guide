"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Pandal, Locality, PandalCategory } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { NavigateButton } from "@/components/navigation/NavigateButton";
import { isValidCoordinate, Coordinate } from "@/lib/maps";
import {
  Search,
  Crosshair,
  RotateCcw,
  MapPin,
  ExternalLink,
  Layers,
  Sparkles,
  AlertCircle,
  X,
  List,
} from "lucide-react";

// Default Krishnanagar center coordinates
const KRISHNANAGAR_CENTER: [number, number] = [23.4045, 88.5015];
const DEFAULT_ZOOM = 14;

// Custom Leaflet Icons for Bengali festival theme
const createFestivalIcon = (isSelected: boolean, category: PandalCategory) => {
  const iconColor = isSelected ? "#c59b27" : "#7a121d";
  const pinBorder = isSelected ? "#ffffff" : "#ede4d1";
  const size = isSelected ? 42 : 36;

  const svgHtml = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
      transition: transform 0.2s ease;
    ">
      <svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${iconColor}" stroke="${pinBorder}" stroke-width="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="3.2" fill="#fcfaf5" stroke="${iconColor}" stroke-width="1.2"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "custom-leaflet-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// User's own location pulse marker
const createUserLocationIcon = () => {
  const svgHtml = `
    <div style="
      position: relative;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #2563eb;
      border: 3px solid #ffffff;
      box-shadow: 0 0 10px rgba(37,99,235,0.7);
    ">
      <div style="
        position: absolute;
        top: -6px; left: -6px; right: -6px; bottom: -6px;
        border-radius: 50%;
        border: 2px solid #3b82f6;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `;
  return L.divIcon({
    html: svgHtml,
    className: "custom-user-marker",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

// Map controller component to programmatically pan/zoom
function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

interface InteractiveMapProps {
  pandals: Pandal[];
  localities: Locality[];
  initialSelectedPandalId?: string;
}

export default function InteractiveMapInner({
  pandals,
  localities,
  initialSelectedPandalId,
}: InteractiveMapProps) {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [selectedPandalId, setSelectedPandalId] = useState<string | null>(
    initialSelectedPandalId || null
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocality, setSelectedLocality] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDrawer, setShowDrawer] = useState(false);

  // View state
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    KRISHNANAGAR_CENTER
  );
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);

  // Filter only pandals that have valid numeric coordinates
  const validPandals = pandals.filter(
    (p) =>
      p.is_published &&
      typeof p.latitude === "number" &&
      typeof p.longitude === "number" &&
      isValidCoordinate(p.latitude, p.longitude)
  );

  const filteredPandals = validPandals.filter((p) => {
    if (selectedLocality !== "all" && p.locality_id !== selectedLocality) {
      return false;
    }
    if (selectedCategory !== "all" && p.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName =
        p.name.toLowerCase().includes(q) ||
        (p.name_bn && p.name_bn.toLowerCase().includes(q));
      const matchLocality =
        p.locality?.name.toLowerCase().includes(q) ||
        (p.locality?.name_bn && p.locality.name_bn.toLowerCase().includes(q));
      const matchAddress = p.address.toLowerCase().includes(q);
      return matchName || matchLocality || matchAddress;
    }
    return true;
  });

  const selectedPandal = validPandals.find((p) => p.id === selectedPandalId);

  // Pan to selected pandal when clicked from list or initial prop
  const handleSelectPandal = (pandal: Pandal) => {
    setSelectedPandalId(pandal.id);
    if (pandal.latitude && pandal.longitude) {
      setMapCenter([pandal.latitude, pandal.longitude]);
      setMapZoom(16);
    }
  };

  // Locate user
  const handleLocateMe = () => {
    setLocationError(null);
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userCoord: Coordinate = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setUserLocation(userCoord);
        setMapCenter([userCoord.latitude, userCoord.longitude]);
        setMapZoom(15);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError(
            language === "bn"
              ? "লোকেশন পারমিশন দেওয়া হয়নি।"
              : "Location access was denied. Please allow location permissions in your browser."
          );
        } else if (err.code === err.TIMEOUT) {
          setLocationError(
            language === "bn"
              ? "লোকেশন নির্ণয় করতে সময় বেশি লাগছে।"
              : "Location request timed out. Please try again."
          );
        } else {
          setLocationError(
            language === "bn"
              ? "বর্তমান অবস্থান পাওয়া যায়নি।"
              : "Unable to retrieve your current location."
          );
        }
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  // Reset to default Krishnanagar view
  const handleResetView = () => {
    setSelectedPandalId(null);
    setMapCenter(KRISHNANAGAR_CENTER);
    setMapZoom(DEFAULT_ZOOM);
    setSearchQuery("");
    setSelectedLocality("all");
    setSelectedCategory("all");
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-stone-100">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pointer-events-none">
        {/* Search & Filter Bar */}
        <div className="flex-1 max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-[#ede4d1] p-2 flex items-center gap-2 pointer-events-auto">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-[#78716c] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "bn"
                  ? "মণ্ডপের নাম দিয়ে খুঁজুন..."
                  : "Search pandal by name..."
              }
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-transparent rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7a121d]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Locality Filter Dropdown */}
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            className="hidden md:block text-xs py-2 px-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium focus:outline-none"
          >
            <option value="all">{t.filters.allLocalities}</option>
            {localities.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {language === "bn" ? loc.name_bn : loc.name}
              </option>
            ))}
          </select>

          {/* Category Filter Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="hidden sm:block text-xs py-2 px-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium focus:outline-none"
          >
            <option value="all">{t.categories.all}</option>
            <option value="heritage">{t.categories.heritage}</option>
            <option value="traditional">{t.categories.traditional}</option>
            <option value="theme">{t.categories.theme}</option>
          </select>

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="p-2 rounded-xl bg-[#7a121d] text-white hover:bg-[#8c1622] transition-colors flex items-center gap-1 sm:hidden cursor-pointer"
            title="Toggle pandal list"
          >
            <List className="w-4 h-4" />
            <span className="text-xs font-semibold">
              {filteredPandals.length}
            </span>
          </button>
        </div>

        {/* Quick Map Action Controls (Locate Me & Reset View) */}
        <div className="flex items-center gap-2 pointer-events-auto self-end sm:self-center">
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="px-3.5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#ede4d1] text-[#1c1917] hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title={t.actions.locateMe}
          >
            <Crosshair
              className={`w-4 h-4 text-[#7a121d] ${
                isLocating ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">
              {isLocating ? t.hero.locating : t.actions.locateMe}
            </span>
          </button>

          <button
            onClick={handleResetView}
            className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#ede4d1] text-[#1c1917] hover:bg-stone-50 transition-all cursor-pointer active:scale-95"
            title={t.actions.resetView}
          >
            <RotateCcw className="w-4 h-4 text-[#78716c]" />
          </button>
        </div>
      </div>

      {/* Geolocation Error Alert if any */}
      {locationError && (
        <div className="absolute top-20 left-4 right-4 z-30 max-w-md mx-auto bg-amber-50 border border-amber-300 text-amber-900 px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between text-xs animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{locationError}</span>
          </div>
          <button
            onClick={() => setLocationError(null)}
            className="p-1 hover:text-amber-950"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Map Canvas & Synchronized Side Drawer */}
      <div className="w-full h-full flex relative">
        {/* Leaflet Map */}
        <div className="w-full h-full z-10">
          {mounted && (
            <MapContainer
              key="krishnanagar-interactive-map"
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              {/* OpenStreetMap Tile Layer with standard required attribution */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />

              <MapController center={mapCenter} zoom={mapZoom} />

              {/* User Location Marker if available */}
              {userLocation && (
                <Marker
                  position={[userLocation.latitude, userLocation.longitude]}
                  icon={createUserLocationIcon()}
                >
                  <Popup>
                    <div className="p-2 text-xs font-semibold text-blue-900">
                      {language === "bn" ? "আপনার বর্তমান অবস্থান" : "You are here"}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Pandal Markers */}
              {filteredPandals.map((pandal) => {
                if (!pandal.latitude || !pandal.longitude) return null;
                const isSelected = pandal.id === selectedPandalId;
                const displayName =
                  language === "bn"
                    ? pandal.name_bn || pandal.name
                    : pandal.name;
                const displayLocality =
                  language === "bn"
                    ? pandal.locality?.name_bn || pandal.locality?.name
                    : pandal.locality?.name;

                return (
                  <Marker
                    key={pandal.id}
                    position={[pandal.latitude, pandal.longitude]}
                    icon={createFestivalIcon(isSelected, pandal.category)}
                    eventHandlers={{
                      click: () => handleSelectPandal(pandal),
                    }}
                  >
                    <Popup minWidth={260} maxWidth={300}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#ede4d1]">
                        {/* Thumbnail */}
                        <div className="relative aspect-16/9 w-full bg-stone-200">
                          <img
                            src={pandal.cover_image_url}
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-[#5e0c15] text-[#fcfaf5] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#c59b27]/40 shadow-xs">
                            {t.categories[pandal.category]}
                          </div>
                        </div>

                        {/* Info & Navigation */}
                        <div className="p-3 space-y-2">
                          <div>
                            <span className="text-[10px] font-bold text-[#7a121d] flex items-center gap-0.5 uppercase tracking-wider">
                              <MapPin className="w-3 h-3" />
                              {displayLocality}
                            </span>
                            <h4 className="font-serif font-bold text-sm text-[#1c1917] mt-0.5">
                              {displayName}
                            </h4>
                          </div>

                          {/* Direct Google Maps Navigation */}
                          <NavigateButton
                            latitude={pandal.latitude}
                            longitude={pandal.longitude}
                            isVerified={pandal.is_verified}
                            pandalName={displayName}
                            className="w-full"
                          />

                          {/* Link to Detail Page */}
                          <Link
                            href={`/pandals/${pandal.slug}`}
                            className="w-full py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-[#ede4d1] text-stone-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>{t.actions.viewDetails}</span>
                            <ExternalLink className="w-3 h-3 text-[#7a121d]" />
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>

        {/* Synchronized Side List (Desktop: persistent sidebar, Mobile: toggleable drawer) */}
        <div
          className={`absolute md:relative z-20 top-0 bottom-0 right-0 w-80 md:w-96 bg-white/95 backdrop-blur-md border-l border-[#ede4d1] shadow-xl flex flex-col transition-transform duration-300 ${
            showDrawer
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-[#ede4d1] flex items-center justify-between bg-[#fcfaf5]">
            <div>
              <h3 className="font-serif font-bold text-base text-[#5e0c15]">
                {language === "bn" ? "মণ্ডপ পরিক্রমা তালিকা" : "Krishnanagar Pandals"}
              </h3>
              <p className="text-xs text-[#78716c]">
                {filteredPandals.length}{" "}
                {language === "bn"
                  ? "টি স্থান ম্যাপে দেখানো হচ্ছে"
                  : "verified locations on map"}
              </p>
            </div>
            <button
              onClick={() => setShowDrawer(false)}
              className="p-1 rounded-lg text-stone-500 hover:text-stone-800 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredPandals.length === 0 ? (
              <div className="text-center py-12 px-4 text-[#78716c]">
                <p className="font-semibold text-sm">{t.empty.noPandals}</p>
                <p className="text-xs mt-1">{t.empty.noPandalsDesc}</p>
                <button
                  onClick={handleResetView}
                  className="mt-3 text-xs font-bold text-[#7a121d] hover:underline"
                >
                  {t.actions.clearFilters}
                </button>
              </div>
            ) : (
              filteredPandals.map((pandal) => {
                const isSelected = pandal.id === selectedPandalId;
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
                    onClick={() => handleSelectPandal(pandal)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? "bg-[#fdfaf2] border-[#c59b27] shadow-md ring-1 ring-[#c59b27]"
                        : "bg-white border-[#ede4d1] hover:bg-stone-50"
                    }`}
                  >
                    <img
                      src={pandal.cover_image_url}
                      alt={displayName}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 bg-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#7a121d]">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{displayLocality}</span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#1c1917] truncate mt-0.5">
                        {displayName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {t.categories[pandal.category]}
                        </span>
                        <Link
                          href={`/pandals/${pandal.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-bold text-[#7a121d] hover:underline flex items-center gap-0.5 ml-auto"
                        >
                          <span>{t.actions.viewDetails}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

