"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useDataStore } from "@/lib/data/useDataStore";
import { PandalCard } from "@/components/pandal/PandalCard";
import { PandalFilters } from "@/components/pandal/PandalFilters";
import { MapPin, Compass } from "lucide-react";

export default function ExplorePandalsPage() {
  const { t, language } = useLanguage();
  const { pandals: allPandals, localities } = useDataStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "name" | "locality">(
    "featured"
  );

  const handleReset = () => {
    setSearchQuery("");
    setSelectedLocality("all");
    setSelectedCategory("all");
    setVerifiedOnly(false);
    setWheelchairOnly(false);
    setSortBy("featured");
  };

  const filteredAndSortedPandals = useMemo(() => {
    let result = allPandals.filter((p) => {
      if (selectedLocality !== "all" && p.locality_id !== selectedLocality) {
        return false;
      }
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      if (verifiedOnly && !p.is_verified) {
        return false;
      }
      if (wheelchairOnly && !p.accessibility?.wheelchair_accessible) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName =
          p.name.toLowerCase().includes(q) ||
          (p.name_bn && p.name_bn.toLowerCase().includes(q));
        const matchAddress = p.address.toLowerCase().includes(q);
        const matchLocality =
          p.locality?.name.toLowerCase().includes(q) ||
          (p.locality?.name_bn && p.locality.name_bn.toLowerCase().includes(q));
        const matchDesc = p.description.toLowerCase().includes(q);
        return matchName || matchAddress || matchLocality || matchDesc;
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "featured") {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name") {
        const nameA = language === "bn" ? a.name_bn || a.name : a.name;
        const nameB = language === "bn" ? b.name_bn || b.name : b.name;
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "locality") {
        const locA = a.locality?.name || "";
        const locB = b.locality?.name || "";
        return locA.localeCompare(locB);
      }
      return 0;
    });

    return result;
  }, [
    allPandals,
    searchQuery,
    selectedLocality,
    selectedCategory,
    verifiedOnly,
    wheelchairOnly,
    sortBy,
    language,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#ede4d1] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7a121d] uppercase tracking-wider mb-1">
          <Compass className="w-3.5 h-3.5 text-[#c59b27]" />
          <span>{t.locationLabel}</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#5e0c15]">
          {t.nav.explore}
        </h1>
        <p className="text-xs sm:text-sm text-[#57534e] mt-1.5 max-w-2xl">
          {language === "bn"
            ? "কৃষ্ণনগরের সকল প্রধান, ঐতিহ্যবাহী ও শিল্পমণ্ডিত মণ্ডপের পূর্ণাঙ্গ ডিরেক্টরি। সঠিক জিপিএস অবস্থান ও গুগল ম্যাপস নেভিগেশন।"
            : "The comprehensive directory of historic, heritage, and theme Jagadhatri Puja pandals across Krishnanagar with verified navigation."}
        </p>
      </div>

      {/* Filter Component */}
      <PandalFilters
        localities={localities}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocality={selectedLocality}
        onLocalityChange={setSelectedLocality}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        verifiedOnly={verifiedOnly}
        onVerifiedOnlyChange={setVerifiedOnly}
        wheelchairOnly={wheelchairOnly}
        onWheelchairOnlyChange={setWheelchairOnly}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onReset={handleReset}
      />

      {/* Results Count & Active Status */}
      <div className="flex items-center justify-between text-xs text-[#78716c] px-1">
        <span>
          {filteredAndSortedPandals.length}{" "}
          {language === "bn" ? "টি মণ্ডপ পাওয়া গেছে" : "pandals found"}
        </span>
        {(searchQuery ||
          selectedLocality !== "all" ||
          selectedCategory !== "all" ||
          verifiedOnly ||
          wheelchairOnly) && (
          <button
            onClick={handleReset}
            className="text-[#7a121d] font-bold hover:underline cursor-pointer"
          >
            {t.actions.clearFilters}
          </button>
        )}
      </div>

      {/* Pandal Grid */}
      {filteredAndSortedPandals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#ede4d1] shadow-xs space-y-3">
          <MapPin className="w-10 h-10 text-[#c59b27] mx-auto opacity-75" />
          <h3 className="font-serif font-bold text-lg text-[#1c1917]">
            {t.empty.noPandals}
          </h3>
          <p className="text-xs text-[#57534e] max-w-md mx-auto">
            {t.empty.noPandalsDesc}
          </p>
          <button
            onClick={handleReset}
            className="btn-maroon-action px-5 py-2 rounded-xl text-xs font-bold inline-block"
          >
            {t.actions.clearFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPandals.map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} />
          ))}
        </div>
      )}
    </div>
  );
}

