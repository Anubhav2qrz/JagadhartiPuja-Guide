"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  X,
  Loader2,
  Compass,
  ExternalLink,
  Check,
} from "lucide-react";
import {
  LocationSuggestion,
  getKrishnanagarAddressSuggestions,
  KNOWN_KRISHNANAGAR_LOCATIONS,
} from "@/lib/geocoding";

interface GoogleMapsAddressSearchProps {
  value: string;
  onChange: (val: string) => void;
  onSelectLocation: (location: LocationSuggestion) => void;
  placeholder?: string;
  selectedCoordinates?: { latitude: number; longitude: number } | null;
}

export default function GoogleMapsAddressSearch({
  value,
  onChange,
  onSelectLocation,
  placeholder = "Search address or landmark (e.g. Burima chashapara, Rajbari, Bowbazar...)",
  selectedCoordinates,
}: GoogleMapsAddressSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search when query changes
  useEffect(() => {
    let active = true;

    if (!value || value.trim().length === 0) {
      // Empty query shows popular landmarks
      setSuggestions(Object.values(KNOWN_KRISHNANAGAR_LOCATIONS).slice(0, 6));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const results = await getKrishnanagarAddressSuggestions(value, 8);
        if (active) {
          setSuggestions(results);
          setIsLoading(false);
          setActiveIndex(-1);
        }
      } catch {
        if (active) setIsLoading(false);
      }
    }, 180); // Fast 180ms debounce

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [value]);

  // Handle clicking outside to dismiss the suggestion dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (suggestion: LocationSuggestion) => {
    onChange(suggestion.title);
    onSelectLocation(suggestion);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-2">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b2f1e] pointer-events-none flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#8b2f1e]" />
          ) : (
            <Search className="w-4 h-4 text-stone-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8b2f1e]/20 focus:border-[#8b2f1e] transition-all shadow-2xs font-medium text-stone-900 placeholder:text-stone-400"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Floating Suggestions Dropdown (Google Maps Places Style) */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-[#ede4d1] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3.5 py-2 bg-[#fcfaf5] border-b border-[#ede4d1] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#4a1810] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-[#d99b26]" />
              {!value ? "Popular Krishnanagar Landmarks" : "Address Suggestions"}
            </span>
            <span className="text-[10px] text-stone-400">
              {suggestions.length} places found
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => {
                const isSelected =
                  selectedCoordinates &&
                  Math.abs(selectedCoordinates.latitude - item.latitude) <
                    0.0005 &&
                  Math.abs(selectedCoordinates.longitude - item.longitude) <
                    0.0005;

                const isActive = activeIndex === idx;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#fcfaf5]"
                        : isSelected
                        ? "bg-emerald-50/50"
                        : "hover:bg-stone-50"
                    }`}
                  >
                    {/* Google-style Pin Icon */}
                    <div
                      className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5 border ${
                        isSelected
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-rose-50 text-[#8b2f1e] border-rose-200"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <MapPin className="w-4 h-4 text-[#8b2f1e]" />
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                          {item.title}
                        </span>
                        {item.categoryLabel && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 shrink-0">
                            {item.categoryLabel}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                        {item.address}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center space-y-1">
                <p className="text-xs text-stone-600 font-medium">
                  No places found for &quot;{value}&quot;
                </p>
                <p className="text-[11px] text-stone-400">
                  Try typing the locality name (e.g., Chasapara, Rajbari, Golapatti) or click anywhere directly on the map below to drop the pin.
                </p>
              </div>
            )}
          </div>

          <div className="p-2 bg-stone-50 border-t border-[#ede4d1] text-[10px] text-stone-500 flex items-center justify-between px-3">
            <span>Use ↑ ↓ keys to navigate, Enter to select</span>
            <span>📍 Click on map anytime to reposition pin</span>
          </div>
        </div>
      )}
    </div>
  );
}

