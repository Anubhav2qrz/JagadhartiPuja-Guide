"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Pandal } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useRoutePlanner } from "@/lib/route-planner/RoutePlannerContext";
import { NavigateButton } from "@/components/navigation/NavigateButton";
import { formatDate } from "@/lib/utils";
import {
  Heart,
  Plus,
  Check,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles,
  Accessibility,
  ArrowRight,
} from "lucide-react";

interface PandalCardProps {
  pandal: Pandal;
}

export function PandalCard({ pandal }: PandalCardProps) {
  const { t, language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInRoute, addStop, removeStop } = useRoutePlanner();

  const favorite = isFavorite(pandal.id);
  const inRoute = isInRoute(pandal.id);

  const displayName =
    language === "bn" ? pandal.name_bn || pandal.name : pandal.name;
  const secondaryName =
    language === "bn" ? pandal.name : pandal.name_bn;
  const displayLocality =
    language === "bn"
      ? pandal.locality?.name_bn || pandal.locality?.name || "কৃষ্ণনগর"
      : pandal.locality?.name || "Krishnanagar";
  const displayDescription =
    language === "bn"
      ? pandal.description_bn || pandal.description
      : pandal.description;

  const categoryLabel = t.categories[pandal.category] || pandal.category;

  return (
    <div className="bg-[#ffffff] rounded-2xl overflow-hidden border border-[#ede4d1] shadow-sm hover:shadow-md transition-all flex flex-col group relative">
      {/* Pandal Cover Image & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-200">
        <img
          src={pandal.cover_image_url}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Category Badge */}
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#5e0c15]/90 text-[#fcfaf5] backdrop-blur-xs border border-[#c59b27]/40 shadow-xs">
              {categoryLabel}
            </span>

            {/* Featured Badge */}
            {pandal.is_featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c59b27] text-[#1c1917] shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(pandal.id);
            }}
            className={`p-2 rounded-full pointer-events-auto backdrop-blur-sm transition-all shadow-md ${
              favorite
                ? "bg-rose-600 text-white"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
            title={favorite ? t.actions.saved : t.actions.saveFavorite}
            aria-label={t.actions.saveFavorite}
          >
            <Heart
              className={`w-4 h-4 ${favorite ? "fill-white" : ""}`}
            />
          </button>
        </div>

        {/* Verification Status Pill (Bottom Image Overlay) */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          {pandal.is_verified ? (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 backdrop-blur-xs flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{t.status.verified}</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-amber-950/80 text-amber-200 border border-amber-500/40 backdrop-blur-xs flex items-center gap-1 shadow-xs">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>{t.status.unverified}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality */}
          <div className="flex items-center gap-1 text-xs text-[#7a121d] font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{displayLocality}</span>
          </div>

          {/* Title */}
          <Link
            href={`/pandals/${pandal.slug}`}
            className="group-hover:text-[#7a121d] transition-colors"
          >
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1c1917] leading-tight">
              {displayName}
            </h3>
            {secondaryName && secondaryName !== displayName && (
              <p className="text-xs text-[#78716c] font-medium mt-0.5">
                {secondaryName}
              </p>
            )}
          </Link>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#57534e] line-clamp-2 mt-2 leading-relaxed">
            {displayDescription}
          </p>

          {/* Meta Details: Verified Timings or Accessibility */}
          <div className="mt-3 pt-3 border-t border-[#ede4d1] flex items-center justify-between text-[11px] text-[#78716c]">
            {pandal.verified_at ? (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#c59b27]" />
                <span>
                  {t.status.lastVerified}: {formatDate(pandal.verified_at)}
                </span>
              </div>
            ) : (
              <span className="italic text-stone-400">
                {language === "bn" ? "মাঠপর্যায়ে যাচাইাধীন" : "Audit pending"}
              </span>
            )}

            {pandal.accessibility?.wheelchair_accessible && (
              <span
                className="flex items-center gap-0.5 text-emerald-700 font-medium"
                title={t.status.wheelchairYes}
              >
                <Accessibility className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-4 pt-3 border-t border-[#ede4d1] space-y-2">
          {/* Navigate with Google Maps (Primary requirement) */}
          <NavigateButton
            latitude={pandal.latitude}
            longitude={pandal.longitude}
            isVerified={pandal.is_verified}
            pandalName={displayName}
            showModeSelector={true}
          />

          {/* Secondary Actions: Add to Route & View Details */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                if (inRoute) {
                  removeStop(pandal.id);
                } else {
                  addStop(pandal.id);
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                inRoute
                  ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                  : "bg-white hover:bg-stone-50 text-[#1c1917] border-[#ede4d1]"
              }`}
            >
              {inRoute ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.actions.inRoute}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-[#7a121d]" />
                  <span>{t.actions.addToRoute}</span>
                </>
              )}
            </button>

            <Link
              href={`/pandals/${pandal.slug}`}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-[#ede4d1] text-[#1c1917] transition-colors flex items-center justify-center gap-1 border border-stone-200"
            >
              <span>{t.actions.viewDetails}</span>
              <ArrowRight className="w-3 h-3 text-[#7a121d]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

