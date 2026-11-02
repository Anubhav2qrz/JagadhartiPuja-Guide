"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Pandal } from "@/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useRoutePlanner } from "@/lib/route-planner/RoutePlannerContext";
import { NavigateButton } from "@/components/navigation/NavigateButton";
import { CorrectionModal } from "@/components/feedback/CorrectionModal";
import { formatDate, formatTime } from "@/lib/utils";
import {
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Plus,
  Check,
  Share2,
  Accessibility,
  Compass,
  ArrowLeft,
  FileEdit,
  Phone,
} from "lucide-react";

interface PandalDetailClientProps {
  pandal: Pandal;
}

export function PandalDetailClient({ pandal }: PandalDetailClientProps) {
  const { t, language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInRoute, addStop, removeStop } = useRoutePlanner();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);

  const favorite = isFavorite(pandal.id);
  const inRoute = isInRoute(pandal.id);

  const displayName =
    language === "bn" ? pandal.name_bn || pandal.name : pandal.name;
  const secondaryName =
    language === "bn" ? pandal.name : pandal.name_bn;
  const displayLocality =
    language === "bn"
      ? pandal.locality?.name_bn || pandal.locality?.name
      : pandal.locality?.name;
  const displayDescription =
    language === "bn"
      ? pandal.description_bn || pandal.description
      : pandal.description;
  const displayAddress =
    language === "bn" ? pandal.address_bn || pandal.address : pandal.address;

  const allImages =
    pandal.gallery && pandal.gallery.length > 0
      ? [pandal.cover_image_url, ...pandal.gallery]
      : [pandal.cover_image_url];
  const uniqueImages = Array.from(new Set(allImages));

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareData = {
      title: `${displayName} — Jagadhatri Darshan Krishnanagar`,
      text: displayDescription.slice(0, 120),
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back to Explore */}
      <div>
        <Link
          href="/pandals"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#7a121d] hover:text-[#5e0c15] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.nav.explore}</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#5e0c15] text-[#fcfaf5] border border-[#c59b27]/30">
                {t.categories[pandal.category]}
              </span>

              {pandal.is_verified ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.status.verifiedCoords}</span>
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.status.unverified}</span>
                </span>
              )}

              {pandal.is_featured && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#c59b27] text-[#1c1917] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            {/* Title & Secondary Title */}
            <h1 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#5e0c15]">
              {displayName}
            </h1>
            {secondaryName && secondaryName !== displayName && (
              <p className="text-sm sm:text-base text-[#78716c] font-medium">
                {secondaryName}
              </p>
            )}

            {/* Address */}
            <p className="text-xs sm:text-sm text-[#7a121d] font-semibold flex items-center gap-1.5 pt-1">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{displayAddress}</span>
            </p>
          </div>

          {/* Quick Action Buttons (Favorite & Share & Add Route) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleFavorite(pandal.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                favorite
                  ? "bg-rose-50 text-rose-600 border-rose-300"
                  : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
              }`}
              title={favorite ? t.actions.saved : t.actions.saveFavorite}
              aria-label={t.actions.saveFavorite}
            >
              <Heart
                className={`w-5 h-5 ${favorite ? "fill-rose-600" : ""}`}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-all cursor-pointer relative"
              title={t.actions.share}
              aria-label={t.actions.share}
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => {
                if (inRoute) {
                  removeStop(pandal.id);
                } else {
                  addStop(pandal.id);
                }
              }}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                inRoute
                  ? "bg-amber-50 text-amber-900 border-amber-300"
                  : "bg-white text-[#1c1917] border-[#ede4d1] hover:bg-stone-50"
              }`}
            >
              {inRoute ? (
                <>
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>{t.actions.inRoute}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#7a121d]" />
                  <span>{t.actions.addToRoute}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Primary Navigation Banner */}
        <div className="mt-6 pt-6 border-t border-[#ede4d1]">
          <NavigateButton
            latitude={pandal.latitude}
            longitude={pandal.longitude}
            isVerified={pandal.is_verified}
            pandalName={displayName}
            showModeSelector={true}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Media Gallery & Core Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl overflow-hidden border border-[#ede4d1] shadow-xs">
            <div className="relative aspect-16/10 w-full bg-stone-200">
              <img
                src={uniqueImages[activeImageIndex] || pandal.cover_image_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Strip */}
            {uniqueImages.length > 1 && (
              <div className="p-3 bg-[#fcfaf5] border-t border-[#ede4d1] flex items-center gap-2 overflow-x-auto">
                {uniqueImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-[#c59b27] ring-2 ring-[#c59b27]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${displayName} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Story & History */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-xl text-[#5e0c15]">
              {language === "bn" ? "ঐতিহ্য ও বিবরণ" : "Tradition & Description"}
            </h2>
            <p className="text-sm sm:text-base text-[#1c1917] leading-relaxed whitespace-pre-line font-light">
              {displayDescription}
            </p>

            {pandal.committee_contact && (
              <div className="mt-4 pt-4 border-t border-[#ede4d1] flex items-center gap-2 text-xs text-[#57534e]">
                <Phone className="w-4 h-4 text-[#c59b27]" />
                <span>
                  {language === "bn" ? "কমিটি যোগাযোগ" : "Committee Contact"}:{" "}
                  {pandal.committee_contact}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Information & Map Coordinates (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Darshan Timings & Verification */}
          <div className="bg-white rounded-3xl p-6 border border-[#ede4d1] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1c1917] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#c59b27]" />
              <span>{t.status.darshanTimings}</span>
            </h3>

            {pandal.darshan_start && pandal.darshan_end ? (
              <div className="bg-[#fcfaf5] p-4 rounded-2xl border border-[#ede4d1] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#5e0c15]">
                    {language === "bn" ? "সূচনা" : "Commencement"}:
                  </span>
                  <span>
                    {formatDate(pandal.darshan_start)} at{" "}
                    {formatTime(pandal.darshan_start)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#5e0c15]">
                    {language === "bn" ? "সমাপ্তি" : "Conclusion"}:
                  </span>
                  <span>
                    {formatDate(pandal.darshan_end)} at{" "}
                    {formatTime(pandal.darshan_end)}
                  </span>
                </div>
                {pandal.timings_verified_at && (
                  <p className="text-[11px] text-emerald-700 pt-1 border-t border-[#ede4d1] font-medium">
                    &bull; {t.status.lastVerified}:{" "}
                    {formatDate(pandal.timings_verified_at)}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#78716c] italic bg-stone-50 p-3 rounded-xl border border-stone-200">
                {language === "bn"
                  ? "২০২৬ উৎসবের বিশেষ সময়সূচি এখনও যাচাইধীন রয়েছে।"
                  : "Festival timing schedule is currently undergoing field verification."}
              </p>
            )}

            {/* Accessibility */}
            <div className="pt-2">
              <h4 className="font-serif font-bold text-sm text-[#1c1917] mb-2 flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-[#7a121d]" />
                <span>{t.status.accessibility}</span>
              </h4>
              <div className="space-y-1.5 text-xs text-[#57534e]">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pandal.accessibility?.wheelchair_accessible
                        ? "bg-emerald-500"
                        : "bg-stone-300"
                    }`}
                  />
                  <span>
                    {pandal.accessibility?.wheelchair_accessible
                      ? t.status.wheelchairYes
                      : t.status.wheelchairNo}
                  </span>
                </div>
                {pandal.accessibility?.notes && (
                  <p className="text-[11px] text-[#78716c] pl-4">
                    {language === "bn"
                      ? pandal.accessibility.notes_bn ||
                        pandal.accessibility.notes
                      : pandal.accessibility.notes}
                  </p>
                )}
              </div>
            </div>

            {/* GPS Coordinates */}
            <div className="pt-2 border-t border-[#ede4d1]">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                {language === "bn" ? "জিপিএস অবস্থান" : "GPS Coordinates"}
              </span>
              {pandal.latitude && pandal.longitude ? (
                <div className="flex items-center justify-between text-xs text-[#1c1917] font-mono bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span>
                    {pandal.latitude.toFixed(5)}, {pandal.longitude.toFixed(5)}
                  </span>
                  <Link
                    href={`/map?pandal=${pandal.id}`}
                    className="text-[#7a121d] font-bold hover:underline font-sans text-xs flex items-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{t.actions.viewOnMap}</span>
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-amber-700 italic">
                  {t.status.unverifiedNotice}
                </p>
              )}
            </div>

            {/* Correction Submission CTA */}
            <div className="pt-2">
              <button
                onClick={() => setCorrectionModalOpen(true)}
                className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-stone-100 hover:bg-[#ede4d1] text-stone-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5 text-[#7a121d]" />
                <span>{t.actions.reportCorrection}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Correction Modal */}
      <CorrectionModal
        isOpen={correctionModalOpen}
        onClose={() => setCorrectionModalOpen(false)}
        pandalId={pandal.id}
        defaultPandalName={displayName}
      />
    </div>
  );
}

