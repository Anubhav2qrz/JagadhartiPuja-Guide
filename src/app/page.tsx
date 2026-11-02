"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useDataStore } from "@/lib/data/useDataStore";
import { PandalCard } from "@/components/pandal/PandalCard";
import { PlaceCard } from "@/components/essentials/PlaceCard";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import {
  Flame,
  Landmark,
  MapPin,
  Route,
  Compass,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Clock,
  Heart,
  Navigation,
  Utensils,
  ChevronRight,
  Crosshair,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [locatingUser, setLocatingUser] = useState(false);
  const [userNearbyNotice, setUserNearbyNotice] = useState<string | null>(null);

  const {
    pandals: allPandals,
    localities,
    places,
    announcements,
  } = useDataStore();

  // Featured and category-specific slices
  const featuredPandals = allPandals.filter((p) => p.is_featured).slice(0, 3);
  const heritagePandals = allPandals
    .filter((p) => p.category === "heritage")
    .slice(0, 3);
  const themePandals = allPandals
    .filter((p) => p.category === "theme")
    .slice(0, 3);
  const foodPlaces = places.filter((pl) => pl.category === "sweet_shop").slice(0, 2);

  // Hero Locate Me action (user-initiated only)
  const handleNearMeClick = () => {
    if (!("geolocation" in navigator)) {
      setUserNearbyNotice("Geolocation is not supported by your browser.");
      return;
    }
    setLocatingUser(true);
    setUserNearbyNotice(null);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocatingUser(false);
        // Redirect to map with active location
        window.location.href = "/map";
      },
      (err) => {
        setLocatingUser(false);
        setUserNearbyNotice(t.hero.locationDenied);
      },
      { timeout: 6000 }
    );
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center bg-[#5e0c15] text-[#fcfaf5] overflow-hidden">
        {/* Festival Background Image with Dark Vignette & Gold Hue */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Burima%2C_Krishnanagar.jpg"
            alt="Krishnanagar Jagadhatri Puja"
            className="w-full h-full object-cover object-center opacity-30 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5e0c15] via-[#5e0c15]/80 to-transparent" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#500710]/60 to-[#3b050c]/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c59b27]/20 border border-[#c59b27]/50 text-[#e6be58] text-xs sm:text-sm font-bold backdrop-blur-xs shadow-md">
            <Flame className="w-4 h-4 text-[#e6be58]" />
            <span>{t.hero.badge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27]" />
            <span>{t.locationLabel}</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#fcfaf5] leading-tight sm:leading-none max-w-4xl mx-auto">
            {t.hero.title}
          </h1>

          {/* Tagline / Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#ede4d1]/90 max-w-2xl mx-auto leading-relaxed font-light">
            {t.hero.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <Link
              href="/pandals"
              className="btn-gold-action w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95"
            >
              <Compass className="w-5 h-5" />
              <span>{t.hero.exploreBtn}</span>
            </Link>

            <Link
              href="/route-planner"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold bg-[#7a121d] hover:bg-[#8c1622] text-white border border-[#c59b27]/50 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Route className="w-5 h-5 text-[#e6be58]" />
              <span>{t.hero.planRouteBtn}</span>
            </Link>

            <button
              onClick={handleNearMeClick}
              disabled={locatingUser}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-black/40 hover:bg-black/60 text-[#ede4d1] border border-white/20 flex items-center justify-center gap-2 transition-all backdrop-blur-xs cursor-pointer active:scale-95"
            >
              <Crosshair
                className={`w-4 h-4 text-[#e6be58] ${
                  locatingUser ? "animate-spin" : ""
                }`}
              />
              <span>
                {locatingUser ? t.hero.locating : t.hero.useLocationBtn}
              </span>
            </button>
          </div>

          {userNearbyNotice && (
            <p className="text-xs text-amber-300 bg-black/40 py-1.5 px-4 rounded-lg inline-block">
              {userNearbyNotice}
            </p>
          )}

          {/* Key Stat Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto border-t border-white/10 text-left">
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-lg sm:text-xl font-bold font-serif text-[#e6be58] block">
                10+
              </span>
              <span className="text-[11px] text-[#ede4d1]/80">
                {language === "bn" ? "ঐতিহাসিক মণ্ডপ" : "Verified Pandals"}
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-lg sm:text-xl font-bold font-serif text-[#e6be58] block">
                1762
              </span>
              <span className="text-[11px] text-[#ede4d1]/80">
                {language === "bn" ? "রাজকীয় ইতিহাস" : "Royal Heritage Year"}
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-lg sm:text-xl font-bold font-serif text-[#e6be58] block">
                100%
              </span>
              <span className="text-[11px] text-[#ede4d1]/80">
                {language === "bn" ? "ম্যাপস নেভিগেশন" : "Direct Maps Links"}
              </span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-lg sm:text-xl font-bold font-serif text-[#e6be58] block">
                GI Tag
              </span>
              <span className="text-[11px] text-[#ede4d1]/80">
                {language === "bn" ? "সরপুরিয়া ও সরভাজা" : "Sarpuria Confection"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OFFICIAL FESTIVAL ANNOUNCEMENTS & POLICE ADVISORIES */}
      {announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#fcfaf5] border-l-4 border-[#c59b27] p-5 sm:p-6 rounded-2xl shadow-sm border border-[#ede4d1] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#7a121d] uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-[#c59b27]" />
              <span>{t.discovery.advisoriesTitle}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white p-4 rounded-xl border border-[#ede4d1] space-y-1 shadow-2xs"
                >
                  <h4 className="font-serif font-bold text-sm text-[#1c1917]">
                    {language === "bn" ? ann.title_bn : ann.title}
                  </h4>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    {language === "bn" ? ann.body_bn : ann.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED PANDALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#ede4d1] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#7a121d] uppercase tracking-wider">
              <Landmark className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Krishnanagar Landmarks</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#5e0c15] mt-0.5">
              {t.discovery.featuredTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] mt-1">
              {t.discovery.featuredSubtitle}
            </p>
          </div>
          <Link
            href="/pandals"
            className="text-xs sm:text-sm font-bold text-[#7a121d] hover:text-[#5e0c15] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>{t.nav.explore}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPandals.map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} />
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE MAP PREVIEW PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f7f3e8] rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#7a121d] uppercase tracking-wider block">
                {t.discovery.mapPreviewTitle}
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#5e0c15] mt-1">
                {language === "bn"
                  ? "কৃষ্ণনগরের ম্যাপে সরাসরি মণ্ডপ দর্শন"
                  : "Explore All Verified Pandals on the Map"}
              </h2>
              <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl">
                {t.discovery.mapPreviewSubtitle}
              </p>
            </div>
            <Link
              href="/map"
              className="btn-maroon-action px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Compass className="w-4 h-4" />
              <span>{t.discovery.viewFullMap}</span>
            </Link>
          </div>

          {/* Interactive Map Preview Box */}
          <div className="rounded-2xl overflow-hidden border border-[#ede4d1] shadow-md h-[400px]">
            <InteractiveMap
              pandals={allPandals}
              localities={localities}
              initialSelectedPandalId="pandal-chasapara-buri-maa"
            />
          </div>
        </div>
      </section>

      {/* 5. MULTI-STOP ROUTE PLANNING PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#5e0c15] to-[#3d050d] text-[#fcfaf5] rounded-3xl p-8 sm:p-12 border border-[#c59b27]/40 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold text-[#e6be58] uppercase tracking-wider block">
              {t.discovery.routePromoTitle}
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#fcfaf5] leading-tight">
              {language === "bn"
                ? "পছন্দের মণ্ডপ সাজিয়ে এক ক্লিকে গুগল ম্যাপসে রুট খুলুন"
                : "Plan Your Multi-Stop Hopping Route with Ease"}
            </h2>
            <p className="text-xs sm:text-sm text-[#ede4d1]/90 leading-relaxed">
              {t.discovery.routePromoSubtitle}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/route-planner"
                className="btn-gold-action px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"
              >
                <Route className="w-4 h-4" />
                <span>{t.discovery.planItinerary}</span>
              </Link>
              <Link
                href="/pandals"
                className="px-5 py-3 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-[#fcfaf5] border border-white/20 transition-colors"
              >
                {t.hero.exploreBtn}
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute -right-6 -bottom-6 w-80 h-80 opacity-15 text-[#c59b27]">
            <Route className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* 6. FOOD & VISITOR ESSENTIALS PREVIEW (SARPURIA & SARBHAJA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#ede4d1] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#7a121d] uppercase tracking-wider">
              <Utensils className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Taste of Krishnanagar</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#5e0c15] mt-0.5">
              {language === "bn"
                ? "খাবার ও পুজো পরিক্রমার প্রয়োজনীয় তথ্য"
                : "Food, GI Sweets & Visitor Essentials"}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] mt-1">
              {language === "bn"
                ? "ঐতিহাসিক সরপুরিয়া-সরভাজা, অনুমোদিত পুজো পার্কিং এবং জরুরি প্রাথমিক চিকিৎসা।"
                : "Official festival parking, emergency medical points, and legendary heritage sweet shops."}
            </p>
          </div>
          <Link
            href="/essentials"
            className="text-xs sm:text-sm font-bold text-[#7a121d] hover:text-[#5e0c15] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>{language === "bn" ? "সব সুবিধা দেখুন" : "View All Places"}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foodPlaces.map((pl) => (
            <PlaceCard key={pl.id} place={pl} />
          ))}
        </div>
      </section>

      {/* 7. HERITAGE & TRADITIONAL PUJA HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mb-12">
        <div className="border-b border-[#ede4d1] pb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#7a121d] uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Sacred Traditions</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#5e0c15] mt-0.5">
            {t.discovery.heritageTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#78716c] mt-1">
            {t.discovery.heritageSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heritagePandals.map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} />
          ))}
        </div>
      </section>
    </div>
  );
}
