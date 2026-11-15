"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Calendar,
  Sparkles,
  Flame,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Clock,
  Landmark,
  Compass,
  AlertTriangle,
  Info,
  ChevronRight,
  Heart,
  Music,
  Users,
  Eye,
  CheckCircle2,
} from "lucide-react";

export default function TraditionsPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "dates" | "sang" | "rituals" | "viewing" | "safety">("overview");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
      {/* 1. Header Hero */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d99b26]/20 border border-[#d99b26]/50 text-[#8b2f1e] text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-[#d99b26] fill-[#d99b26]" />
          <span>{language === "bn" ? "ঐতিহ্য ও আচার নির্দেশিকা ২০২৬" : "Rituals, Sang & Immersion Guide 2026"}</span>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-[#4a1810] leading-tight">
          {language === "bn"
            ? "কৃষ্ণনগর জগদ্ধাত্রী পূজা ২০২৬: বিসর্জন, সাঙ শোভাযাত্রা ও আচার-অনুষ্ঠানের পূর্ণাঙ্গ গাইড"
            : "Krishnanagar Jagadhatri Puja 2026: Complete Guide to Immersion, Sang, Rituals & Traditions"}
        </h1>
        <p className="text-sm sm:text-base text-[#57534e] max-w-3xl mx-auto leading-relaxed">
          {language === "bn"
            ? "কৃষ্ণনগরের জগদ্ধাত্রী পূজা পশ্চিমবঙ্গের এক অনন্য সাংস্কৃতিক ও আধ্যাত্মিক মহোৎসব। বেহারাদের কাঁধে ঐতিহ্যবাহী সাঙ শোভাযাত্রা, দুই দিনের ভাসান, রাজকীয় চার প্রহর পূজা এবং ঐতিহাসিক বারোয়ারীর গভীর শ্রদ্ধাঞ্জলি।"
            : "Celebrated for centuries with unparalleled religious devotion, grand golden ornaments, the iconic bearer-borne Sang (সাঙ) processions, the two-day Bhashan carnival, and the sacred waters of the Jalangi River."}
        </p>

        {/* Tab Selector for Quick Jump */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-4">
          {[
            { id: "overview", labelEn: "Overview", labelBn: "একঝলকে" },
            { id: "dates", labelEn: "2026 Dates & Two-Day Bhashan", labelBn: "২০২৬ নির্ঘণ্ট ও দুই দিনের ভাসান" },
            { id: "sang", labelEn: "The Sang (সাঙ) Tradition", labelBn: "ঐতিহাসিক সাঙ প্রথা" },
            { id: "rituals", labelEn: "Sacred Rituals & 4 Prahars", labelBn: "পূজার আচার ও চার প্রহর" },
            { id: "viewing", labelEn: "Viewing Spots & Plan", labelBn: "দর্শন কেন্দ্র ও পরিকল্পনা" },
            { id: "safety", labelEn: "Safety & Emergency (112)", labelBn: "নিরাপত্তা ও হেল্পলাইন" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#8b2f1e] text-[#f5ba42] shadow-md border border-[#d99b26]/50"
                  : "bg-white text-[#57534e] border border-[#ede4d1] hover:bg-[#fcfaf5]"
              }`}
            >
              {language === "bn" ? tab.labelBn : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SECTION: Important Dates & Two-Day Bhashan (16 - 20 Nov 2026) */}
      {(activeTab === "overview" || activeTab === "dates") && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ede4d1] pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#4a1810] text-[#f5ba42]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1c1917]">
                  {language === "bn"
                    ? "জগদ্ধাত্রী পূজা ২০২৬ — গুরুত্বপূর্ণ তারিখ ও তিথি"
                    : "Jagadhatri Puja 2026 — Key Dates & Schedule"}
                </h2>
                <p className="text-xs text-[#78716c]">
                  {language === "bn"
                    ? "১৬ নভেম্বর থেকে ২০ নভেম্বর ২০২৬: মূল পূজা ও ঐতিহ্যবাহী দুই দিনের ভাসান"
                    : "16 November to 20 November 2026: Main worship & Two-Day Immersion Carnival"}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-[#f5ba42]/20 text-[#8b2f1e] px-3 py-1 rounded-full border border-[#d99b26]/40 self-start sm:self-auto">
              {language === "bn" ? "২০২৬ ক্যালেন্ডার" : "2026 Calendar"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Saptami */}
            <div className="bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede4d1] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b2f1e] bg-[#8b2f1e]/10 px-2.5 py-0.5 rounded-md inline-block">
                16 Nov 2026 (Mon) • সপ্তমী
              </span>
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                {language === "bn" ? "মহাসপ্তমী পূজা সূচনা" : "Saptami — Puja Inauguration"}
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "উৎসবের সূচনা, ঘট স্থাপন, দেবীর বোধন ও প্রাণপ্রতিষ্ঠা এবং শহরের আলোকসজ্জার শুভ উদ্বোধন।"
                  : "Beginning of major festival worship, invocation ceremonies, and ceremonial illumination across Krishnanagar."}
              </p>
            </div>

            {/* Ashtami */}
            <div className="bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede4d1] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b2f1e] bg-[#8b2f1e]/10 px-2.5 py-0.5 rounded-md inline-block">
                17 Nov 2026 (Tue) • মহাষ্টমী
              </span>
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                {language === "bn" ? "মহাষ্টমী পূজা ও পুষ্পাঞ্জলি" : "Ashtami — Sacred Worship & Offerings"}
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "বিশেষ পূজা, পুষ্পাঞ্জলি, ভোগ নিবেদন এবং গভীর ভক্তিমূলক প্রার্থনার দিন।"
                  : "Special rites, mass community pushpanjali, sacred bhog distribution, and evening devotion."}
              </p>
            </div>

            {/* Navami */}
            <div className="bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede4d1] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b2f1e] bg-[#8b2f1e]/10 px-2.5 py-0.5 rounded-md inline-block">
                18 Nov 2026 (Wed) • মহানবমী
              </span>
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                {language === "bn" ? "মহানবমী প্রধান পূজা ও সন্ধিপূজা" : "Navami — Principal Puja & Sandhi Puja"}
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "মূল মহাপূজা, ৪৮ মিনিটের সন্ধিপূজা (১০৮ প্রদীপ ও ১০৮ পদ্ম), রাজবাড়ির চার প্রহর পূজা এবং বিপুল ভক্ত সমাগম।"
                  : "The peak spiritual day: principal worship, 48-min Sandhi Puja (108 lamps & lotuses), and Chasapara Buri Maa's massive bhog."}
              </p>
            </div>

            {/* Dashami - Day 1 Bhashan */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border-2 border-[#d99b26] space-y-2 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b2f1e] bg-[#f5ba42]/30 px-2.5 py-0.5 rounded-md inline-block">
                  19 Nov 2026 (Thu) • প্রথম দিন
                </span>
                <span className="text-[10px] font-bold bg-[#8b2f1e] text-white px-2 py-0.5 rounded-md">
                  Carnival
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#4a1810]">
                {language === "bn"
                  ? "ঘাট বিসর্জন ও পুজো কার্নিভাল"
                  : "First-Day Ghat Bhashan & Carnival"}
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "সকাল ১০:০০ টা থেকে বিকেল ৪:০০ টা পর্যন্ত ঘাট বিসর্জন। সুবিশাল কার্নিভালে সুসজ্জিত ট্যাবলয়েড, শিল্পকলার প্রদর্শনী ও সাংস্কৃতিক অনুষ্ঠান।"
                  : "Ghat Bhashan (approx. 10:00 AM – 4:00 PM), farewell rituals, accompanied by the grand Krishnanagar Jagadhatri Carnival."}
              </p>
            </div>

            {/* Second-Day Bhashan & Sang */}
            <div className="bg-linear-to-br from-[#8b2f1e]/10 to-[#d99b26]/20 p-5 rounded-2xl border-2 border-[#8b2f1e] space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b2f1e] bg-[#8b2f1e] text-white px-2.5 py-0.5 rounded-md inline-block">
                  20 Nov 2026 (Fri) • দ্বিতীয় দিন
                </span>
                <span className="text-[10px] font-bold bg-[#d99b26] text-[#1c1917] px-2 py-0.5 rounded-md">
                  Traditional Sang
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#4a1810]">
                {language === "bn"
                  ? "ঐতিহাসিক সাঙ শোভাযাত্রা ও চূড়ান্ত নিরঞ্জন"
                  : "Second-Day Bhashan & Traditional Sang Processions"}
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "শত শত বেহারাদের কাঁধে ঐতিহ্যবাহী বাঁশের সাঙে চেপে মা জগদ্ধাত্রীর সুবিশাল প্রতিমা পরিক্রমা। ঢাকের বোল, মশাল ও হাজারো মানুষের আবেগময় বিদায় নিয়ে জলঙ্গী নদীর কদমতলা ঘাটে চূড়ান্ত বিসর্জন।"
                  : "The pinnacle cultural spectacle: colossal idols hoisted on bamboo Sang palanquins by hundreds of traditional Beharas, illuminated by flaming torches (moshals) and carried to the Jalangi River."}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#fcfaf5] border border-[#ede4d1] flex items-start gap-2.5 text-xs text-[#78716c]">
            <Info className="w-4 h-4 text-[#d99b26] shrink-0 mt-0.5" />
            <p>
              {language === "bn"
                ? "বিজ্ঞপ্তি: স্থানীয় পাঁজি ও নিজ নিজ পূজা কমিটির সিদ্ধান্ত অনুসারে সঠিক তিথি ও সময়সূচিতে সামান্য পরিবর্তন হতে পারে। চূড়ান্ত আনুষ্ঠানিক রুট ও সময়ের জন্য কমিটি ও ট্রাফিক পুলিশের নির্দেশিকা অনুসরণ করুন।"
                : "Note: Exact tithi timings and observance may differ slightly according to local panjikas and individual puja committees. Please consult respective organizers and police advisories for final ritual times."}
            </p>
          </div>
        </section>
      )}

      {/* 3. SECTION: The Tradition of Sang (সাঙ) & The Beharas */}
      {(activeTab === "overview" || activeTab === "sang") && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8b2f1e] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d99b26]" />
            <span>Living Heritage Tradition</span>
          </div>
          <div className="max-w-3xl space-y-2">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1c1917]">
              {language === "bn"
                ? "সাঙ (Sang) — কৃষ্ণনগরের শতাব্দীপ্রাচীন নিরঞ্জন প্রথা"
                : "The Tradition of Sang (সাঙ) — The Sacred Palanquin"}
            </h2>
            <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
              {language === "bn"
                ? "কৃষ্ণনগর জগদ্ধাত্রী পূজার অন্যতম অবিস্মরণীয় আকর্ষণ হলো ঐতিহ্যবাহী 'সাঙ' শোভাযাত্রা। সাঙ হলো বাঁশ ও কাঠের তৈরি এক বিশেষ পালকি বা মাচা, যার উপর প্রতিমাকে স্থাপন করে শত শত বেহারা তাঁদের কাঁধে তুলে রাজকীয় তালে নৃত্যরত ভঙ্গিতে শহরের রাজপথ দিয়ে নিয়ে যান।"
                : "A Sang is a specially engineered carrying palanquin framework used to transport the towering idols of Maa Jagadhatri. Idols are carried on the shoulders of traditional bearer groups—locally known as Beharas—rather than ordinary motor vehicles."}
            </p>
          </div>

          {/* 7-Step Procession Journey */}
          <div className="space-y-3 pt-2">
            <h3 className="font-serif font-bold text-base text-[#4a1810]">
              {language === "bn"
                ? "কীভাবে সাঙ শোভাযাত্রা অনুষ্ঠিত হয় (ধাপে ধাপে):"
                : "How the Sang Procession Takes Place (Step-by-Step):"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  step: "01",
                  titleEn: "Framework Construction",
                  titleBn: "সাঙের প্রস্তুতি",
                  descEn: "Heavy bamboo and seasoned timber framework constructed to hold multi-ton deities safely.",
                  descBn: "সুবিশাল প্রতিমার ভর ধরে রাখতে মজবুত বাঁশের কাঠামো ও মাচা নিখুঁতভাবে তৈরি করা হয়।",
                },
                {
                  step: "02",
                  titleEn: "Selection of Beharas",
                  titleBn: "বেহারা নির্বাচন",
                  descEn: "Traditional generational bearer teams (Beharas) assemble and coordinate the shoulder lift.",
                  descBn: "বংশপরম্পরায় প্রশিক্ষিত অভিজ্ঞ বেহারা দল একত্রিত হয়ে কাঁধে তোলার স্থান নির্বাচন করেন।",
                },
                {
                  step: "03",
                  titleEn: "Ornamental Decoration",
                  titleBn: "সাঙের সাজসজ্জা",
                  descEn: "Adorned with floral garlands, silk drapes, brass fixtures, and traditional flaming torches (moshals).",
                  descBn: "রঙিন কাপড়, ফুলের মালা, পিতলের অলঙ্করণ ও ঐতিহ্যবাহী জ্বলন্ত মশালের আলোয় সাঙ সাজানো হয়।",
                },
                {
                  step: "04",
                  titleEn: "Sacred Departure",
                  titleBn: "মণ্ডপ থেকে প্রস্থান",
                  descEn: "After final arati and tears of devotion, the goddess is lifted amidst thunderous conch calls.",
                  descBn: "বিদায় আরতির পর উলুধ্বনি ও শঙ্খধ্বনির মাঝে দেবীকে মণ্ডপ থেকে বাইরে আনা হয়।",
                },
                {
                  step: "05",
                  titleEn: "Rhythmic Dhak Beats",
                  titleBn: "ঢাকের ছন্দ ও সঙ্গীত",
                  descEn: "Traditional dhakis set rhythmic cadence as the bearers dance in unison through the night.",
                  descBn: "ঐতিহ্যবাহী ঢাক ও কাঁসির রাজকীয় ছন্দে বেহারারা একাত্ম হয়ে পা মিলিয়ে অগ্রসর হন।",
                },
                {
                  step: "06",
                  titleEn: "Royal Street Journey",
                  titleBn: "কৃষ্ণনগরের পথে পরিক্রমা",
                  descEn: "The procession traverses High Street, Post Office More, and royal heritage avenues.",
                  descBn: "রাজবাড়ি চত্বর, পোস্ট অফিস মোড় ও শহরের প্রধান রাজপথ ধরে হাজারো মানুষের ভিড়ে এগিয়ে চলে।",
                },
                {
                  step: "07",
                  titleEn: "Jalangi Immersion",
                  titleBn: "কদমতলা ঘাটে নিরঞ্জন",
                  descEn: "Arrival at Kadamtala Ghat on the Jalangi River for final farewell and water immersion.",
                  descBn: "জলঙ্গী নদীর কদমতলা ঘাটে অন্তিম প্রণাম ও ভক্তদের অশ্রুসজল চোখে প্রতিমা নিরঞ্জন সম্পন্ন হয়।",
                },
              ].map((item) => (
                <div key={item.step} className="bg-[#fcfaf5] p-4 rounded-xl border border-[#ede4d1] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#8b2f1e] bg-[#f5ba42]/30 px-2 py-0.5 rounded-md inline-block">
                    {item.step}
                  </span>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1c1917]">
                    {language === "bn" ? item.titleBn : item.titleEn}
                  </h4>
                  <p className="text-[11px] text-[#57534e] leading-relaxed">
                    {language === "bn" ? item.descBn : item.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200">
            <h4 className="font-serif font-bold text-sm text-[#8b2f1e] mb-2">
              {language === "bn" ? "সাঙ শোভাযাত্রার প্রধান প্রধান আকর্ষণ:" : "Major Attractions of the Sang Procession:"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-[#57534e]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{language === "bn" ? "ঐতিহ্যবাহী ঢাক ও ভক্তিগীতি" : "Traditional dhak & devotional music"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{language === "bn" ? "প্রজ্বলিত মশাল (Moshals)" : "Blazing torches (Moshals)"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{language === "bn" ? "বেহারাদের রাজকীয় ছন্দময় পদক্ষেপ" : "Synchronized bearer movements"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{language === "bn" ? "চন্দ্রালোকিত রাজপথ ও ঝাড়বাতি" : "Illuminated festive heritage streets"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{language === "bn" ? "লক্ষাধিক ভক্ত ও পুরবাসীর সমাগম" : "Mass gathering of devotees & visitors"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{language === "bn" ? "মা জগদ্ধাত্রীর অশ্রুসজল বিদায়" : "Emotional farewell to Maa Jagadhatri"}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SECTION: Major Pujas & Their Immersion Significance */}
      {(activeTab === "overview" || activeTab === "sang") && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8b2f1e] uppercase tracking-wider">
            <Landmark className="w-4 h-4 text-[#d99b26]" />
            <span>Historic Barowari Lineage</span>
          </div>
          <div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1c1917]">
              {language === "bn"
                ? "বিখ্যাত ঐতিহাসিক পূজা ও তাদের বিসর্জন গুরুত্ব"
                : "Major Historic Pujas & Their Immersion Lineage"}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] mt-1">
              {language === "bn"
                ? "কৃষ্ণনগরের বুড়ি মা, ছোট মা, মেজো মা ও বাঘা মায়ের ঐতিহ্যবাহী প্রতিষ্ঠা কাল ও প্রথা।"
                : "The legendary royal and public deities that anchor Krishnanagar's devotional history."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Chasapara Buri Maa */}
            <div className="bg-[#fcfaf5] p-5 rounded-2xl border-2 border-[#d99b26] space-y-2">
              <span className="text-[10px] font-bold text-[#8b2f1e] bg-[#f5ba42]/30 px-2 py-0.5 rounded-md inline-block">
                Est. 1772 CE
              </span>
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                {language === "bn" ? "চাষাপাড়া বারোয়ারী — বুড়ি মা" : "Chasapara — Buri Maa"}
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "কৃষ্ণনগরের পরম শ্রদ্ধাভাজন মহিমাময়ী প্রতিমা। সুবিশাল স্বর্ণমুকুট ও বহু ভরি সোনার গয়নায় ভূষিতা। ঐতিহ্য অনুসারে বিসর্জনের শেষ প্রধান সাঙ শোভাযাত্রা তাঁর।"
                  : "The sovereign deity of Krishnanagar, draped in hundreds of sovereigns of pure gold jewelry. Traditionally culminates the town's major concluding Sang procession."}
              </p>
            </div>

            {/* Kanthalpota Choto Maa */}
            <div className="bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede4d1] space-y-2">
              <span className="text-[10px] font-bold text-[#8b2f1e] bg-[#f5ba42]/30 px-2 py-0.5 rounded-md inline-block">
                Est. 1774 CE
              </span>
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                {language === "bn" ? "কাঁঠালপোতা বারোয়ারী — ছোট মা" : "Kanthalpota — Choto Maa"}
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "ঐতিহাসিক ডাকের সাজ ও স্নিগ্ধ দেবীমূর্তি। অন্যতম প্রধান আকর্ষণ যার বিসর্জন পরিক্রমা দেখতে প্রচুর মানুষের সমাগম ঘটে।"
                  : "Famous for sublime Daker Saaj and classical clay modeling. Her immersion procession is a central highlight of the festival."}
              </p>
            </div>

            {/* College Street Mejo Maa */}
            <div className="bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede4d1] space-y-2">
              <span className="text-[10px] font-bold text-[#8b2f1e] bg-[#f5ba42]/30 px-2 py-0.5 rounded-md inline-block">
                Est. 1803 CE
              </span>
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                {language === "bn" ? "কলেজ স্ট্রিট বারোয়ারী — মেজো মা" : "College Street — Mejo Maa"}
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "ঐতিহ্যমণ্ডিত প্রাচীন প্রতিমা ও পারিবারিক আন্তরিকতা। দুই শতকের বেশি সময় ধরে ভক্তি ও আন্তরিকতায় সমৃদ্ধ।"
                  : "Renowned for devotional antiquity and rich community participation spanning well over two centuries."}
              </p>
            </div>

            {/* Baghadanga Bagha Maa */}
            <div className="bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede4d1] space-y-2">
              <span className="text-[10px] font-bold text-[#8b2f1e] bg-[#f5ba42]/30 px-2 py-0.5 rounded-md inline-block">
                Est. 1810 CE
              </span>
              <h3 className="font-serif font-bold text-base text-[#1c1917]">
                {language === "bn" ? "বাঘাডাঙ্গা বারোয়ারী — বাঘা মা" : "Baghadanga — Bagha Maa"}
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "তাঁর বলিষ্ঠ রাজকীয় সিংহ বাহন ও অনবদ্য প্রতিমা মৃৎশিল্পের জন্য বিখ্যাত। কৃষ্ণনগরের অন্যতম প্রধান ঐতিহ্যবাহী পূজা।"
                  : "Celebrated for her magnificent lion mount and distinctive clay artistry crafted by traditional master sculptors."}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#78716c]">
            {language === "bn"
              ? "এছাড়াও নুরীপাড়া চারদিনী মা (চার দিনের প্রাচীন পূজা), গোলাপট্টি, রাধানগর অন্নপূর্ণা, আদি ও নতুন বারোয়ারী, বউবাজার এবং চকেরপাড়া বিশেষ মর্যাদাসম্পন্ন।"
              : "Other distinguished historic pujas include Nuripara Chardini Maa (4-day worship), Golapatti, Radhanagar Annapurna, Radhanagar Adi, Bowbazar, and Chakerpara."}
          </p>
        </section>
      )}

      {/* 5. SECTION: Sacred Rituals & The Royal Four-Prahar Tradition */}
      {(activeTab === "overview" || activeTab === "rituals") && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8b2f1e] uppercase tracking-wider">
            <Heart className="w-4 h-4 text-[#d99b26]" />
            <span>Vedic & Tantric Heritage</span>
          </div>
          <div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1c1917]">
              {language === "bn"
                ? "পূজার পবিত্র আচার ও রাজবাড়ির চার প্রহর প্রথা"
                : "Sacred Rituals & The Royal Four-Prahar Tradition"}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] mt-1">
              {language === "bn"
                ? "কৃষ্ণনগর রাজবাড়ির চার প্রহর পূজা এবং জগদ্ধাত্রী আরাধনার নিগূঢ় আধ্যাত্মিক শাস্ত্রবিধি।"
                : "The canonical rituals that distinguish Krishnanagar's worship from conventional celebrations."}
            </p>
          </div>

          {/* Royal 4 Prahars Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-linear-to-br from-[#4a1810] to-[#2d0e0a] text-[#fcfaf5] border border-[#d99b26]/50 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f5ba42]" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#f5ba42]">
                {language === "bn"
                  ? "কৃষ্ণনগরের বিশেষ চার প্রহর (Four-Prahar) রাজ প্রথা"
                  : "The Sovereign Four-Prahar System on Mahanavami"}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#ede4d1]/90 leading-relaxed">
              {language === "bn"
                ? "কৃষ্ণনগর রাজবাড়ির প্রথা অনুসারে মহানবমীর একটি মাত্র পুণ্য তিথিতেই চার প্রহরের মাধ্যমে সপ্তমী, অষ্টমী, নবমী ও দশমীর সম্পূর্ণ পূজা ধারাবাহিকভাবে সম্পন্ন করা হয়।"
                : "According to Krishnanagar Rajbari tradition, the four sequential stages of worship associated with Saptami, Ashtami, Navami, and Dashami are performed successively within the four prahars of Mahanavami."}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="text-[10px] text-[#f5ba42] block font-bold uppercase tracking-wider">1st Prahar</span>
                <span className="text-xs sm:text-sm font-semibold">{language === "bn" ? "সপ্তমী পূজা" : "Saptami Puja"}</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="text-[10px] text-[#f5ba42] block font-bold uppercase tracking-wider">2nd Prahar</span>
                <span className="text-xs sm:text-sm font-semibold">{language === "bn" ? "অষ্টমী পূজা" : "Ashtami Puja"}</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="text-[10px] text-[#f5ba42] block font-bold uppercase tracking-wider">3rd Prahar</span>
                <span className="text-xs sm:text-sm font-semibold">{language === "bn" ? "নবমী মহাপূজা" : "Navami Mahapuja"}</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="text-[10px] text-[#f5ba42] block font-bold uppercase tracking-wider">4th Prahar</span>
                <span className="text-xs sm:text-sm font-semibold">{language === "bn" ? "দশমী সমাপনী" : "Dashami Rituals"}</span>
              </div>
            </div>
          </div>

          {/* Core Rituals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#fcfaf5] p-4 rounded-xl border border-[#ede4d1] space-y-1">
              <h4 className="font-serif font-bold text-sm text-[#1c1917]">
                {language === "bn" ? "মঙ্গল ঘট (Mangal Ghat)" : "Mangal Ghat"}
              </h4>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "পবিত্র জলঙ্গী নদী থেকে বিশেষ শোভাযাত্রা সহকারে জল সংগ্রহ করে মঙ্গল ঘট স্থাপন করা হয়।"
                  : "Sacred water collected ceremonially from the Jalangi River to invoke the divine presence."}
              </p>
            </div>

            <div className="bg-[#fcfaf5] p-4 rounded-xl border border-[#ede4d1] space-y-1">
              <h4 className="font-serif font-bold text-sm text-[#1c1917]">
                {language === "bn" ? "সন্ধিপূজা (৪৮ মিনিট)" : "Sandhi Puja (48 Minutes)"}
              </h4>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "অষ্টমীর শেষ ২৪ মিনিট ও নবমীর প্রথম ২৪ মিনিটের সন্ধিক্ষণে ১০৮টি প্রদীপ ও পদ্ম সহকারে বিশেষ পূজা।"
                  : "The pivotal 48-minute celestial transition celebrated with 108 oil lamps and 108 blue lotuses."}
              </p>
            </div>

            <div className="bg-[#fcfaf5] p-4 rounded-xl border border-[#ede4d1] space-y-1">
              <h4 className="font-serif font-bold text-sm text-[#1c1917]">
                {language === "bn" ? "কুমারী পূজা ও হোম" : "Kumari Puja & Homa"}
              </h4>
              <p className="text-xs text-[#57534e] leading-relaxed">
                {language === "bn"
                  ? "শক্তি ও পবিত্রতার প্রতীক রূপে দেবীকন্যা আরাধনা এবং পবিত্র বৈদিক হোম যজ্ঞের সম্পাদন।"
                  : "Worship of a young girl as living manifestation of Divine Shakti followed by Vedic sacred fire rites."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 6. SECTION: Viewing Locations & Recommended 2-Day Plan */}
      {(activeTab === "overview" || activeTab === "viewing") && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8b2f1e] uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#d99b26]" />
            <span>Spectator Guide</span>
          </div>
          <div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1c1917]">
              {language === "bn"
                ? "বিসর্জন দেখার সেরা স্থান ও দুই দিনের পরিকল্পনা"
                : "Key Immersion Viewing Locations & Recommended Plan"}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716c] mt-1">
              {language === "bn"
                ? "কোথায় দাঁড়ালে সবচেয়ে সুন্দরভাবে সাঙ শোভাযাত্রা ও আলোকসজ্জা উপভোগ করা যাবে।"
                : "Optimal vantage points along the royal avenues and riverfront for families and photographers."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-[#4a1810]">
                {language === "bn" ? "প্রধান দর্শনীয় কেন্দ্রসমূহ:" : "Prime Spectator Vantage Points:"}
              </h3>
              <div className="space-y-2 text-xs text-[#57534e]">
                <div className="p-3 rounded-xl bg-[#fcfaf5] border border-[#ede4d1]">
                  <strong className="text-[#1c1917] block">Chasapara (চাষাপাড়া)</strong>
                  {language === "bn"
                    ? "বুড়ি মা-র রাজকীয় সাঙ তোলা ও মণ্ডপ চত্বরের অভূতপূর্ব ভক্তিময় পরিবেশ।"
                    : "Epicenter of Buri Maa's grand palanquin hoist and unmatched devotional fervor."}
                </div>
                <div className="p-3 rounded-xl bg-[#fcfaf5] border border-[#ede4d1]">
                  <strong className="text-[#1c1917] block">Rajbari Road & High Street (রাজবাড়ি অ্যাপ্রোচ রোড)</strong>
                  {language === "bn"
                    ? "ঐতিহাসিক স্থাপত্য, রাজকীয় চত্বর ও আলোকময় শোভাযাত্রার মূল পরিভ্রমণ পথ।"
                    : "Historic thoroughfare where processions pass under dazzling Chandannagar illuminations."}
                </div>
                <div className="p-3 rounded-xl bg-[#fcfaf5] border border-[#ede4d1]">
                  <strong className="text-[#1c1917] block">Kadamtala Ghat on Jalangi River (কদমতলা ঘাট)</strong>
                  {language === "bn"
                    ? "নদীকূলে চূড়ান্ত বিসর্জন, নৌকার বহর ও প্রতিমা নিরঞ্জনের আবেগঘন মুহূর্ত।"
                    : "Sacred riverfront destination where final farewell rites and water immersions occur."}
                </div>
              </div>
            </div>

            {/* Suggested Timing Plan */}
            <div className="bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede4d1] space-y-3">
              <h3 className="font-serif font-bold text-base text-[#8b2f1e]">
                {language === "bn" ? "দর্শনার্থীদের জন্য প্রস্তাবিত সময়সারণী:" : "Suggested Visiting Timetable:"}
              </h3>
              <ul className="space-y-2.5 text-xs text-[#57534e]">
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#d99b26] shrink-0 mt-0.5" />
                  <div>
                    <strong>19 Nov (Day 1) Morning & Afternoon:</strong>
                    <span> {language === "bn" ? "ঘাট বিসর্জন ও কার্নিভাল ট্যাবলয়েড প্রদর্শন।" : "Daytime Ghat Bhashan & Carnival tableaux presentations."}</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#d99b26] shrink-0 mt-0.5" />
                  <div>
                    <strong>20 Nov (Day 2) Afternoon:</strong>
                    <span> {language === "bn" ? "সাঙের প্রস্তুতি দর্শন ও কাঁঠালপোতা-কলেজ স্ট্রিট পরিদর্শন।" : "Observe Sang frameworks & visit major barowaris."}</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#d99b26] shrink-0 mt-0.5" />
                  <div>
                    <strong>20 Nov (Day 2) Evening (7:00 PM onwards):</strong>
                    <span> {language === "bn" ? "প্রধান সাঙ শোভাযাত্রা, মশাল, ঢাকের বোল ও কদমতলা ঘাটে নিরঞ্জন।" : "Witness prime Sang procession, moshals, dhak, and riverfront immersion."}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 7. SECTION: Police Arrangements, Emergency Helplines & Safety Rules */}
      {(activeTab === "overview" || activeTab === "safety") && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#d99b26]/50 shadow-md space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8b2f1e] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>KPD Smart Puja Guide 2026 & Safety</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Emergency Helpline Numbers */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#1c1917]">
                {language === "bn" ? "জরুরি হেল্পলাইন নম্বর" : "Emergency Helpline Numbers"}
              </h3>
              <p className="text-xs text-[#78716c]">
                {language === "bn"
                  ? "যে কোনো জরুরি পরিস্থিতিতে অবিলম্বে নিচের নম্বরগুলিতে যোগাযোগ করুন:"
                  : "One-tap direct dials for police, medical, and emergency control:"}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="tel:112"
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between hover:bg-rose-100 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold block uppercase">National Emergency</span>
                    <span className="font-serif font-bold text-lg">112</span>
                  </div>
                  <PhoneCall className="w-4 h-4 text-rose-600" />
                </a>

                <a
                  href="tel:100"
                  className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between hover:bg-blue-100 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold block uppercase">Police Helpline</span>
                    <span className="font-serif font-bold text-lg">100</span>
                  </div>
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                </a>

                <a
                  href="tel:102"
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between hover:bg-emerald-100 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold block uppercase">Ambulance</span>
                    <span className="font-serif font-bold text-lg">102</span>
                  </div>
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                </a>

                <a
                  href="tel:03472252222"
                  className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between hover:bg-amber-100 transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold block uppercase">Nadia Police Control</span>
                    <span className="font-serif font-bold text-xs truncate">03472-252222</span>
                  </div>
                  <PhoneCall className="w-4 h-4 text-amber-700" />
                </a>
              </div>

              <div className="pt-2">
                <a
                  href="https://x.com/krishnanagarpd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8b2f1e] font-bold hover:underline"
                >
                  <span>Krishnanagar Police District Official Updates</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right: 10 Sang Safety Guidelines */}
            <div className="lg:col-span-7 bg-[#fcfaf5] p-5 rounded-2xl border border-[#ede4d1] space-y-3">
              <h3 className="font-serif font-bold text-base text-[#4a1810] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{language === "bn" ? "সাঙ শোভাযাত্রার সময় ১০টি নিরাপত্তা বিধি:" : "10 Safety Rules During the Sang Procession:"}</span>
              </h3>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#57534e] list-decimal list-inside leading-relaxed">
                <li>{language === "bn" ? "চলন্ত সাঙের ঠিক সামনে দাঁড়াবেন না।" : "Never stand directly in front of a moving Sang."}</li>
                <li>{language === "bn" ? "পুলিশের ব্যারিকেড বা ড্রপ-গেটে চাপ দেবেন না।" : "Do not push against barricades or drop gates."}</li>
                <li>{language === "bn" ? "শিশুদের চলন্ত বাঁশের কাঠামো থেকে দূরে রাখুন।" : "Keep children safely away from moving frameworks."}</li>
                <li>{language === "bn" ? "নদীঘাটের নিষিদ্ধ বা বিপজ্জনক এলাকায় যাবেন না।" : "Avoid entering restricted ghat zones on the river."}</li>
                <li>{language === "bn" ? "মোবাইল ফোন ও মূল্যবান সামগ্রী সুরক্ষিত রাখুন।" : "Keep phones and valuables securely zipped."}</li>
                <li>{language === "bn" ? "কর্তব্যরত পুলিশ ও স্বেচ্ছাসেবকদের নির্দেশ মানুন।" : "Follow police and volunteer directions strictly."}</li>
                <li>{language === "bn" ? "নদীর খাড়া বা ভিড় পাড়ে দাঁড়ানো থেকে বিরত থাকুন।" : "Do not stand on steep, overcrowded riverbanks."}</li>
                <li>{language === "bn" ? "সাঙ আসার সময় হঠাৎ রাস্তা পারাপার করবেন না।" : "Never attempt to cross when the Sang is in motion."}</li>
                <li>{language === "bn" ? "জরুরি হেল্পলাইন নম্বর ফোনে সেভ রাখুন।" : "Keep emergency helpline numbers easily accessible."}</li>
                <li>{language === "bn" ? "অনুমোদিত পার্কিং ও পেডেস্ট্রিয়ান রুট ব্যবহার করুন।" : "Park only in official lots and walk designated paths."}</li>
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* 8. Call to Action Navigation Footer */}
      <div className="text-center pt-4 pb-8 space-y-4">
        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#4a1810]">
          {language === "bn" ? "কৃষ্ণনগর জগদ্ধাত্রী পূজা ২০২৬ — জয় মা জগদ্ধাত্রী!" : "Krishnanagar Jagadhatri Puja 2026 — Jai Maa Jagadhatri!"}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/pandals"
            className="btn-gold-action px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"
          >
            <Compass className="w-4 h-4" />
            <span>{language === "bn" ? "সব মণ্ডপ দেখুন" : "Explore All Pandals"}</span>
          </Link>
          <Link
            href="/route-planner"
            className="btn-maroon-action px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg"
          >
            <Calendar className="w-4 h-4" />
            <span>{language === "bn" ? "পরিক্রমার রুট তৈরি করুন" : "Plan Hopping Route"}</span>
          </Link>
          <Link
            href="/map"
            className="px-5 py-3 rounded-xl text-sm font-bold bg-white text-[#8b2f1e] border border-[#ede4d1] hover:bg-[#fcfaf5] transition-all"
          >
            <MapPin className="w-4 h-4 inline mr-1.5" />
            <span>{language === "bn" ? "ইন্টারেক্টিভ ম্যাপ" : "Interactive Map"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

