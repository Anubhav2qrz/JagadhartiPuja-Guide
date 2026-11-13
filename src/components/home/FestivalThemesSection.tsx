"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FESTIVAL_THEMES_2026,
  FestivalThemeItem,
} from "@/lib/data/festival-themes";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Palette,
  Search,
  X,
  Share2,
  Check,
  LayoutGrid,
  List,
  Compass,
  MapPin,
  ExternalLink,
  Tag,
  Route,
} from "lucide-react";

interface FestivalThemesSectionProps {
  initialSearch?: string;
}

export function FestivalThemesSection({
  initialSearch = "",
}: FestivalThemesSectionProps) {
  const { language } = useLanguage();
  const [selectedParba, setSelectedParba] = useState<"all" | 1 | 2>("all");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Bengali numerals converter helper
  const toBengaliNumber = (num: number): string => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => bengaliDigits[parseInt(d, 10)] ?? d)
      .join("");
  };

  // Filter themes based on Parba and Search Query
  const filteredThemes = useMemo(() => {
    return FESTIVAL_THEMES_2026.filter((item) => {
      // Parba filter
      if (selectedParba !== "all" && item.parba !== selectedParba) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchClub =
          item.club.toLowerCase().includes(q) ||
          item.clubEn.toLowerCase().includes(q);
        const matchTheme =
          item.theme.toLowerCase().includes(q) ||
          item.themeEn.toLowerCase().includes(q);
        const matchLocality = item.locality
          ? item.locality.toLowerCase().includes(q)
          : false;
        const matchSerial =
          item.serial.toString() === q ||
          toBengaliNumber(item.serial) === q;

        return matchClub || matchTheme || matchLocality || matchSerial;
      }
      return true;
    });
  }, [selectedParba, searchQuery]);

  const handleCopyTheme = (item: FestivalThemeItem) => {
    const textToCopy = `${item.club} – ${item.theme} (কৃষ্ণনগর জগদ্ধাত্রী মহোৎসব ২০২৬)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.serial);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const POPULAR_TAGS = [
    { label: "রাধানগর", labelEn: "Radhanagar", query: "রাধানগর" },
    { label: "ঘূর্ণী", labelEn: "Ghurni", query: "ঘূর্ণী" },
    { label: "মহাভারত", labelEn: "Mahabharata", query: "মহাভারত" },
    { label: "এক টুকরো রাজস্থান", labelEn: "Rajasthan", query: "রাজস্থান" },
    { label: "অতলের ওপারে", labelEn: "Ataler Opare", query: "অতলের ওপারে" },
    { label: "পথের পাঁচালী", labelEn: "Pather Panchali", query: "পথের পাঁচালী" },
  ];

  return (
    <section id="themes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#ede4d1] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5ba42]/20 border border-[#d99b26]/50 text-[#8b2f1e] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Palette className="w-3.5 h-3.5 text-[#d99b26]" />
            <span>
              {language === "bn"
                ? "কৃষ্ণনগর জগদ্ধাত্রী মহোৎসব ২০২৬"
                : "Krishnanagar Jagadhatri Mahotsav 2026"}
            </span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#4a1810]">
            {language === "bn"
              ? "২০২৬-এর বিশেষ আকর্ষণ ও মণ্ডপ থিম"
              : "2026 Special Attraction & Puja Themes"}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] mt-1.5 max-w-2xl leading-relaxed">
            {language === "bn"
              ? "একঝলকে কৃষ্ণনগরের শীর্ষ ক্লাব ও বারোয়ারীর ২০২৬-এর বিশেষ ভাবনা, প্রতিমা সজ্জা ও ঐতিহাসিক থিম তালিকা (পর্ব–০১ ও ০২)।"
              : "Explore the official 2026 creative themes, artistic pavilions, and cultural concepts across 48 prominent clubs and barowaris."}
          </p>
        </div>

        {/* Global Action Link to Route Planner */}
        <Link
          href="/route-planner?autoroute=gps"
          className="btn-gold-action px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 self-start md:self-auto shadow-md shrink-0 active:scale-95"
          title="Plan route to visit these pandals"
        >
          <Route className="w-4 h-4 text-[#1c1917]" />
          <span>
            {language === "bn" ? "থিম পরিক্রমা রুট তৈরি করুন" : "Plan Theme Hopping Route"}
          </span>
        </Link>
      </div>

      {/* Interactive Controls Bar: Parba Tabs, Search, and View Switcher */}
      <div className="bg-[#fcfaf5] p-4 sm:p-5 rounded-2xl border border-[#ede4d1] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Parba Filter Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedParba("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedParba === "all"
                  ? "bg-[#8b2f1e] text-white shadow-xs"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {language === "bn" ? "সব থিম (৪৮)" : "All Themes (48)"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedParba(1)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedParba === 1
                  ? "bg-[#8b2f1e] text-white shadow-xs"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {language === "bn" ? "পর্ব–০১ (১–২০)" : "Phase 1 (1–20)"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedParba(2)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedParba === 2
                  ? "bg-[#8b2f1e] text-white shadow-xs"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {language === "bn" ? "পর্ব–০২ (২১–৪৮)" : "Phase 2 (21–48)"}
            </button>
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "ক্লাব বা থিমের নাম খুঁজুন..."
                    : "Search club or theme name..."
                }
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8b2f1e]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-[#8b2f1e] shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-[#8b2f1e] shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Search Tags */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#ede4d1]/70">
          <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-[#d99b26]" />
            <span>{language === "bn" ? "জনপ্রিয়:" : "Popular:"}</span>
          </span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag.query}
              type="button"
              onClick={() => setSearchQuery(tag.query)}
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-colors cursor-pointer border ${
                searchQuery === tag.query
                  ? "bg-[#4a1810] text-[#f5ba42] border-[#4a1810]"
                  : "bg-white text-stone-700 border-stone-200 hover:border-[#8b2f1e] hover:text-[#8b2f1e]"
              }`}
            >
              {language === "bn" ? tag.label : tag.labelEn}
            </button>
          ))}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-[11px] font-semibold text-rose-700 hover:underline ml-1"
            >
              {language === "bn" ? "রিসেট" : "Reset"}
            </button>
          )}
        </div>
      </div>

      {/* Filter Stats Indicator */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          {language === "bn"
            ? `${toBengaliNumber(filteredThemes.length)}টি বিশেষ থিম প্রদর্শিত হচ্ছে`
            : `Showing ${filteredThemes.length} special themes`}
          {selectedParba !== "all" &&
            ` (${language === "bn" ? `পর্ব ${toBengaliNumber(selectedParba)}` : `Phase ${selectedParba}`})`}
        </span>
      </div>

      {/* 1. GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredThemes.map((item) => {
            const serialDisplay =
              language === "bn"
                ? toBengaliNumber(item.serial)
                : item.serial < 10
                ? `0${item.serial}`
                : item.serial.toString();

            const isCopied = copiedId === item.serial;

            return (
              <div
                key={item.serial}
                className="group relative bg-white rounded-2xl p-5 border border-[#ede4d1] hover:border-[#d99b26]/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Card Top: Serial Badge, Parba Tag, and Copy Button */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#4a1810] text-[#f5ba42] font-serif font-bold text-xs flex items-center justify-center border border-[#d99b26]/40 shadow-xs">
                      {serialDisplay}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 uppercase tracking-wide">
                      {language === "bn"
                        ? `পর্ব–০${item.parba}`
                        : `Phase ${item.parba}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyTheme(item)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-[#8b2f1e] hover:bg-[#ede4d1]/50 transition-colors cursor-pointer"
                    title={
                      language === "bn"
                        ? "থিমের নাম কপি করুন"
                        : "Copy theme and club name"
                    }
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Card Content: Theme & Club */}
                <div className="space-y-2">
                  {/* Theme Title (PROMINENT) */}
                  <div className="p-3 bg-[#fcfaf5] rounded-xl border border-[#ede4d1]/80 group-hover:border-[#d99b26]/40 transition-colors">
                    <span className="text-[10px] font-bold text-[#8b2f1e] uppercase tracking-wider block mb-1">
                      {language === "bn" ? "২০২৬ আকর্ষণ ও থিম:" : "2026 Attraction Theme:"}
                    </span>
                    <h3 className="font-serif font-extrabold text-base sm:text-lg text-[#1c1917] leading-snug">
                      "{item.theme}"
                    </h3>
                    <p className="text-[11px] text-stone-500 font-medium italic mt-0.5">
                      {item.themeEn}
                    </p>
                  </div>

                  {/* Club / Barowari Name */}
                  <div className="pt-1">
                    <h4 className="font-serif font-bold text-sm text-[#4a1810] group-hover:text-[#8b2f1e] transition-colors">
                      {item.club}
                    </h4>
                    <p className="text-xs text-stone-500">{item.clubEn}</p>
                  </div>
                </div>

                {/* Card Footer: Locality & Links */}
                <div className="pt-3 border-t border-[#ede4d1]/60 flex items-center justify-between text-xs">
                  {item.locality ? (
                    <span className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#d99b26]" />
                      <span>{item.locality}</span>
                    </span>
                  ) : (
                    <span />
                  )}

                  {item.pandalSlug ? (
                    <Link
                      href={`/pandals/${item.pandalSlug}`}
                      className="text-xs font-bold text-[#8b2f1e] hover:text-[#4a1810] flex items-center gap-1 group-hover:underline"
                    >
                      <span>{language === "bn" ? "মণ্ডপ বিবরণ" : "View Pandal"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <Link
                      href={`/pandals?search=${encodeURIComponent(item.club.replace(" বারোয়ারী", "").replace(" ক্লাব", ""))}`}
                      className="text-[11px] font-semibold text-stone-500 hover:text-[#8b2f1e] flex items-center gap-1"
                    >
                      <Compass className="w-3 h-3" />
                      <span>{language === "bn" ? "অনুসন্ধান" : "Explore"}</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. COMPACT LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-[#ede4d1] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fcfaf5] border-b border-[#ede4d1] text-stone-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 w-12 text-center">নং</th>
                  <th className="p-3.5">ক্লাব / বারোয়ারী</th>
                  <th className="p-3.5">২০২৬ আকর্ষণ ও থিম</th>
                  <th className="p-3.5">পর্ব</th>
                  <th className="p-3.5 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ede4d1]">
                {filteredThemes.map((item) => (
                  <tr
                    key={item.serial}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="p-3.5 text-center font-bold text-stone-700 font-serif">
                      {language === "bn"
                        ? toBengaliNumber(item.serial)
                        : item.serial}
                    </td>
                    <td className="p-3.5">
                      <div className="font-serif font-bold text-stone-900 text-sm">
                        {item.club}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {item.clubEn}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#fcfaf5] border border-[#ede4d1] font-serif font-bold text-xs text-[#8b2f1e]">
                        "{item.theme}"
                      </span>
                      <div className="text-[11px] text-stone-500 italic mt-0.5">
                        {item.themeEn}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold text-[10px]">
                        {language === "bn"
                          ? `পর্ব–০${item.parba}`
                          : `Phase ${item.parba}`}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleCopyTheme(item)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-[#8b2f1e] hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedId === item.serial
                          ? language === "bn"
                            ? "কপি হয়েছে"
                            : "Copied"
                          : language === "bn"
                          ? "কপি"
                          : "Copy"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredThemes.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-[#ede4d1] space-y-3">
          <Palette className="w-8 h-8 text-[#d99b26] mx-auto opacity-50" />
          <h4 className="font-serif font-bold text-base text-[#1c1917]">
            {language === "bn"
              ? "কোনো থিম খুঁজে পাওয়া যায়নি"
              : "No themes found matching your search"}
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {language === "bn"
              ? "অনুসন্ধানের বানান পরীক্ষা করুন অথবা 'রিসেট' বোতামে ক্লিক করুন।"
              : "Try checking the spelling or resetting the search filter."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedParba("all");
            }}
            className="btn-gold-action px-4 py-2 rounded-xl text-xs font-bold"
          >
            {language === "bn" ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
          </button>
        </div>
      )}
    </section>
  );
}
