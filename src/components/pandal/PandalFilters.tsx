"use client";

import React from "react";
import { Locality } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Search, RotateCcw, Check, Filter } from "lucide-react";

interface PandalFiltersProps {
  localities: Locality[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLocality: string;
  onLocalityChange: (loc: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  visitedFilter?: "all" | "unvisited" | "visited";
  onVisitedFilterChange?: (v: "all" | "unvisited" | "visited") => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (v: boolean) => void;
  wheelchairOnly: boolean;
  onWheelchairOnlyChange: (w: boolean) => void;
  sortBy: "featured" | "name" | "locality";
  onSortByChange: (s: "featured" | "name" | "locality") => void;
  onReset: () => void;
}

export function PandalFilters({
  localities,
  searchQuery,
  onSearchChange,
  selectedLocality,
  onLocalityChange,
  selectedCategory,
  onCategoryChange,
  visitedFilter = "all",
  onVisitedFilterChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  wheelchairOnly,
  onWheelchairOnlyChange,
  sortBy,
  onSortByChange,
  onReset,
}: PandalFiltersProps) {
  const { t, language } = useLanguage();

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#ede4d1] shadow-xs space-y-4">
      {/* Top Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.filters.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b2f1e] transition-all"
        />
      </div>

      {/* Row with Categories & Visited Checklist Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
        {/* Categories Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: t.categories.all },
            { id: "heritage", label: t.categories.heritage },
            { id: "traditional", label: t.categories.traditional },
            { id: "theme", label: t.categories.theme },
          ].map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-[#4a1810] text-[#fcfaf5] shadow-xs border border-[#d99b26]/30"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Visited Status Quick Filter Toggle */}
        {onVisitedFilterChange && (
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl self-start sm:self-auto shrink-0 border border-stone-200">
            <button
              type="button"
              onClick={() => onVisitedFilterChange("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                visitedFilter === "all"
                  ? "bg-white text-[#1c1917] shadow-xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {language === "bn" ? "সব" : "All"}
            </button>
            <button
              type="button"
              onClick={() => onVisitedFilterChange("unvisited")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                visitedFilter === "unvisited"
                  ? "bg-[#8b2f1e] text-white shadow-xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title={language === "bn" ? "যেসব মণ্ডপ এখনও দর্শন করা বাকি" : "Pandals you haven't visited yet"}
            >
              <span>{language === "bn" ? "বাকি দর্শন" : "Unvisited"}</span>
            </button>
            <button
              type="button"
              onClick={() => onVisitedFilterChange("visited")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                visitedFilter === "visited"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title={language === "bn" ? "যেসব মণ্ডপ ইতোমধ্যে দর্শন করেছেন" : "Pandals marked as visited"}
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>{language === "bn" ? "দর্শন সম্পন্ন" : "Visited"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Locality Dropdown & Sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
        {/* Locality */}
        <div>
          <label className="block text-[11px] font-bold text-stone-600 mb-1">
            {language === "bn" ? "এলাকা নির্বাচন" : "Filter by Locality"}
          </label>
          <select
            value={selectedLocality}
            onChange={(e) => onLocalityChange(e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#8b2f1e]"
          >
            <option value="all">{t.filters.allLocalities}</option>
            {localities.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {language === "bn" ? loc.name_bn : loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-bold text-stone-600 mb-1">
            {t.filters.sortBy}
          </label>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortByChange(e.target.value as "featured" | "name" | "locality")
            }
            className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-[#8b2f1e]"
          >
            <option value="featured">{t.filters.sortFeatured}</option>
            <option value="name">{t.filters.sortName}</option>
            <option value="locality">{t.filters.sortLocality}</option>
          </select>
        </div>

        {/* Checkbox Toggles & Reset */}
        <div className="flex items-center sm:justify-end gap-3 pt-4 sm:pt-0 sm:self-end">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
              className="rounded text-[#8b2f1e] focus:ring-[#8b2f1e]"
            />
            <span>{t.filters.verifiedOnly}</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={wheelchairOnly}
              onChange={(e) => onWheelchairOnlyChange(e.target.checked)}
              className="rounded text-[#8b2f1e] focus:ring-[#8b2f1e]"
            />
            <span>{t.filters.wheelchairOnly}</span>
          </label>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors ml-auto"
            title={t.actions.clearFilters}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

