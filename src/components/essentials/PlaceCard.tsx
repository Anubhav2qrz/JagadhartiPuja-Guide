"use client";

import React from "react";
import { Place } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { NavigateButton } from "@/components/navigation/NavigateButton";
import {
  Utensils,
  Coffee,
  Car,
  Bath,
  Droplet,
  HeartPulse,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { t, language } = useLanguage();

  const getCategoryIcon = () => {
    switch (place.category) {
      case "sweet_shop":
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case "restaurant":
      case "food_stall":
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case "parking":
        return <Car className="w-4 h-4 text-blue-600" />;
      case "restroom":
        return <Bath className="w-4 h-4 text-purple-600" />;
      case "water":
        return <Droplet className="w-4 h-4 text-cyan-600" />;
      case "first_aid":
        return <HeartPulse className="w-4 h-4 text-rose-600" />;
      default:
        return <MapPin className="w-4 h-4 text-stone-600" />;
    }
  };

  const displayName =
    language === "bn" ? place.name_bn || place.name : place.name;
  const displayDescription =
    language === "bn"
      ? place.description_bn || place.description
      : place.description;
  const displayAddress =
    language === "bn" ? place.address_bn || place.address : place.address;

  const categoryLabel =
    t.essentialsCategories[place.category] || place.category;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#ede4d1] shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Category Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
            {getCategoryIcon()}
            <span>{categoryLabel}</span>
          </div>

          {place.is_verified && (
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.status.verified}</span>
            </span>
          )}
        </div>

        {/* Place Name */}
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#1c1917] mt-1 leading-snug">
          {displayName}
        </h3>

        {/* Address */}
        <p className="text-xs text-[#7a121d] font-semibold flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{displayAddress}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-[#57534e] mt-2.5 leading-relaxed line-clamp-3">
          {displayDescription}
        </p>

        {/* Opening Hours if available */}
        {place.opening_hours && (
          <div className="mt-3 pt-3 border-t border-[#ede4d1] flex items-center gap-1.5 text-xs text-[#78716c]">
            <Clock className="w-3.5 h-3.5 text-[#c59b27] shrink-0" />
            <span>
              {typeof place.opening_hours === "string"
                ? place.opening_hours
                : JSON.stringify(place.opening_hours)}
            </span>
          </div>
        )}
      </div>

      {/* Direct Google Maps Navigation */}
      <div className="mt-5 pt-3 border-t border-[#ede4d1]">
        <NavigateButton
          latitude={place.latitude}
          longitude={place.longitude}
          isVerified={place.is_verified}
          pandalName={displayName}
          showModeSelector={true}
        />
      </div>
    </div>
  );
}

