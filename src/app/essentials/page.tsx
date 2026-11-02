"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useDataStore } from "@/lib/data/useDataStore";
import { PlaceCard } from "@/components/essentials/PlaceCard";
import { PlaceCategory } from "@/types";
import {
  Utensils,
  Search,
  RotateCcw,
  MapPin,
  Coffee,
  Car,
  Bath,
  Droplet,
  HeartPulse,
} from "lucide-react";

export default function EssentialsPage() {
  const { t, language } = useLanguage();
  const { places: allPlaces } = useDataStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: t.essentialsCategories.all, icon: Utensils },
    {
      id: "sweet_shop",
      label: t.essentialsCategories.sweet_shop,
      icon: Coffee,
    },
    { id: "parking", label: t.essentialsCategories.parking, icon: Car },
    { id: "water", label: t.essentialsCategories.water, icon: Droplet },
    {
      id: "first_aid",
      label: t.essentialsCategories.first_aid,
      icon: HeartPulse,
    },
  ];

  const filteredPlaces = useMemo(() => {
    return allPlaces.filter((place) => {
      if (selectedCategory !== "all" && place.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName =
          place.name.toLowerCase().includes(q) ||
          (place.name_bn && place.name_bn.toLowerCase().includes(q));
        const matchAddress = place.address.toLowerCase().includes(q);
        const matchDesc = place.description.toLowerCase().includes(q);
        return matchName || matchAddress || matchDesc;
      }
      return true;
    });
  }, [allPlaces, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#ede4d1] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#8b2f1e] uppercase tracking-wider mb-1">
          <Utensils className="w-3.5 h-3.5 text-[#d99b26]" />
          <span>Taste of Krishnanagar & Visitor Amenities</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#4a1810]">
          {t.nav.essentials}
        </h1>
        <p className="text-xs sm:text-sm text-[#57534e] mt-1.5 max-w-2xl">
          {language === "bn"
            ? "ঐতিহাসিক জিআই স্বীকৃতিপ্রাপ্ত সরপুরিয়া ও সরভাজা মিষ্টির দোকান, উৎসবের অনুমোদিত পার্কিং অঞ্চল, পানীয় জল ও জেলা হাসপাতালের জরুরি প্রাথমিক চিকিৎসা কেন্দ্র।"
            : "Direct Google Maps navigation to verified Krishnanagar GI-tagged sweet shops (Sarpuria & Sarbhaja), designated festival parking zones, drinking water, and round-the-clock medical points."}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#ede4d1] shadow-xs space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "bn"
                ? "মিষ্টির দোকান, পার্কিং বা ফার্স্ট এইড কেন্দ্র খুঁজুন..."
                : "Search sweet shops, parking zones, drinking water..."
            }
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b2f1e] transition-all"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-[#4a1810] text-[#fcfaf5] shadow-xs border border-[#d99b26]/30"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Place Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#78716c] px-1">
          <span>
            {filteredPlaces.length}{" "}
            {language === "bn" ? "টি সুবিধা পাওয়া গেছে" : "places found"}
          </span>
          {(searchQuery || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-[#8b2f1e] font-bold hover:underline cursor-pointer"
            >
              {t.actions.clearFilters}
            </button>
          )}
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#ede4d1] shadow-xs space-y-3">
            <MapPin className="w-10 h-10 text-[#d99b26] mx-auto opacity-75" />
            <h3 className="font-serif font-bold text-lg text-[#1c1917]">
              {t.empty.noPlaces}
            </h3>
            <p className="text-xs text-[#57534e] max-w-md mx-auto">
              {t.empty.noPlacesDesc}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

