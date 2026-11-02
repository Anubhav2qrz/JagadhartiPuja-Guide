"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Sparkles,
  MapPin,
  Compass,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Heart,
  ExternalLink,
} from "lucide-react";

export default function AboutPage() {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-[#ede4d1] pb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c59b27]/20 border border-[#c59b27]/40 text-[#7a121d] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" />
          <span>Heritage of Nadia, West Bengal</span>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-[#5e0c15]">
          {language === "bn"
            ? "কৃষ্ণনগর জগদ্ধাত্রী পূজার গৌরবময় ঐতিহ্য"
            : "The Glorious Heritage of Krishnanagar Jagadhatri Puja"}
        </h1>
        <p className="text-sm sm:text-base text-[#57534e] max-w-2xl mx-auto leading-relaxed">
          {t.tagline}
        </p>
      </div>

      {/* Chapter 1: The Royal Inception (1762) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7a121d] uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-[#c59b27]" />
          <span>Origin: 1762 CE</span>
        </div>
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1c1917]">
          {language === "bn"
            ? "মহারাজা কৃষ্ণচন্দ্র রায় ও পূজার সূচনা"
            : "Maharaja Krishna Chandra Roy & The Royal Foundation"}
        </h2>
        <div className="text-xs sm:text-sm text-[#57534e] space-y-3 leading-relaxed">
          <p>
            {language === "bn"
              ? "১৭৬২ খ্রিস্টাব্দে নদিয়ার মহারাজ কৃষ্ণচন্দ্র রায় নবাব আলীবর্দী খানের কর সংক্রান্ত বিরোধের কারণে বন্দিদশা থেকে মুক্তির পর নদীপথে কৃষ্ণনগরে ফেরার সময় দুর্গাপূজার তিথি অতিক্রান্ত হয়ে যায়। অত্যন্ত ব্যথিত মহারাজাকে মা জগদ্ধাত্রী স্বপ্নাদেশ দেন আগামী শুক্লা নবমীতে তাঁকে পূজা করার জন্য। সেই থেকে কৃষ্ণনগর রাজবাড়িতে রাজরাজেশ্বরী রূপে জগদ্ধাত্রী পূজার সূচনা হয়।"
              : "In 1762 CE, Maharaja Krishna Chandra Roy of Nadia, while returning to Krishnanagar by boat after being released from imprisonment under the Nawab of Bengal in Murshidabad, was heartbroken to find that the sacred Durga Puja days had already passed. According to popular Nadia lore, the Divine Mother Jagadhatri appeared in the Maharaja's vision, instructing him to perform worship on the forthcoming Kartika Shukla Navami. Thus began the immortal royal celebration of Goddess Rajrajeshwari inside the palace courtyard."}
          </p>
          <p>
            {language === "bn"
              ? "পরবর্তীকালে রাজবাড়ির পুজো দেখে কৃষ্ণনগরের বিভিন্ন পাড়ায় সাধারণ মানুষ বারোয়ারী পূজার সূত্রপাত ঘটান, যার মধ্যে চাষাপাড়ার বুড়িমা অন্যতম প্রধান কেন্দ্রবিন্দুতে পরিণত হয়।"
              : "Inspired by the royal palace festivities, the town's prominent merchant communities and local neighborhoods inaugurated their own public barowaris, transforming Krishnanagar into the premier spiritual hub for Jagadhatri worship in Eastern India alongside Chandannagar."}
          </p>
        </div>
      </section>

      {/* Chapter 2: Chasapara Buri Maa */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7a121d] uppercase tracking-wider">
          <Heart className="w-4 h-4 text-[#c59b27]" />
          <span>The Sovereign Mother</span>
        </div>
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1c1917]">
          {language === "bn"
            ? "চাষাপাড়া বুড়িমা — ভক্তদের পরম আশ্রয়"
            : "Chasapara Buri Maa — The Elderly Mother of Krishnanagar"}
        </h2>
        <div className="text-xs sm:text-sm text-[#57534e] space-y-3 leading-relaxed">
          <p>
            {language === "bn"
              ? "কৃষ্ণনগরের প্রতিটি মানুষের কাছে 'বুড়িমা' সাক্ষাৎ জাগ্রত মা। অষ্টাদশ শতাব্দীর মাঝামাঝি এই প্রতিমার আরাধনা শুরু হয়। মাকে স্বর্ণালংকারে সাজিয়ে হাজার হাজার কেজি ভোগ নিবেদন করা হয়। কোনো আড়ম্বরপূর্ণ আলোকসজ্জা বা থিমের প্রতিযোগিতা নয়, দেবীমাতার অকৃত্রিম ভক্তি ও স্নিগ্ধ রূপই বুড়িমার মহিমা।"
              : "Affectionately addressed as 'Buri Maa' (the Elderly Mother), the deity of Chasapara is the emotional epicenter of the festival. Worshiped since the mid-18th century, she is adorned with hundreds of tolas of pure gold ornaments contributed by devotees. Free from commercial theme competitions, Buri Maa represents pure, unadulterated devotion and maternal grace."}
          </p>
        </div>
      </section>

      {/* Chapter 3: The World-Famous Sangha Immersion Procession */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d1] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7a121d] uppercase tracking-wider">
          <Compass className="w-4 h-4 text-[#c59b27]" />
          <span>Unique Festival Ritual</span>
        </div>
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1c1917]">
          {language === "bn"
            ? "ঐতিহাসিক বেহারাদের কাঁধে প্রতিমা নিরঞ্জন শোভাযাত্রা"
            : "The Legendary Behara-Borne Sangha Immersion"}
        </h2>
        <div className="text-xs sm:text-sm text-[#57534e] space-y-3 leading-relaxed">
          <p>
            {language === "bn"
              ? "কৃষ্ণনগর জগদ্ধাত্রী পূজার অন্যতম অবিস্মরণীয় বৈচিত্র্য হলো দশমীর রাতে প্রতিমা বিসর্জন। এখানে কোনো ট্রাক বা যান্ত্রিক বাহন ব্যবহার করা হয় না। সুবিশাল প্রতিমাগুলোকে শত শত বেহারা বাঁশের মাচায় কাঁধে তুলে রাজকীয় ছন্দে নৃত্যরত ভঙ্গিতে জলঙ্গী নদীর কদমতলা ঘাটে নিয়ে যান। এই দৃশ্য দেখতে রাজ্যের নানা প্রান্ত থেকে লক্ষাধিক মানুষের সমাগম হয়।"
              : "A globally unique highlight of Krishnanagar Jagadhatri Puja is the immersion procession on Dashami night. In strict adherence to tradition, mechanical trucks are avoided; instead, colossal multi-tiered idols and sacred brass pots (ghats) are hoisted upon bamboo scaffolding by hundreds of synchronized bearers (beharas). The procession dances through High Street towards the Kadamtala Ghat on the sacred Jalangi river."}
          </p>
        </div>
      </section>

      {/* Editorial Policy & Verification Statement */}
      <section className="bg-[#fcfaf5] rounded-3xl p-6 sm:p-8 border-2 border-[#ede4d1] space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7a121d] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Editorial Integrity Policy</span>
        </div>
        <h3 className="font-serif font-bold text-lg text-[#1c1917]">
          {language === "bn"
            ? "তথ্যের সত্যতা ও দায়িত্বশীল পরিবেশন"
            : "Responsible Data & Sourced Information"}
        </h3>
        <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed">
          {language === "bn"
            ? "জগদ্ধাত্রী দর্শন কোনো কাল্পনিক সময়সূচি বা অসত্য জনপ্রিয়তা রেটিং প্রচার করে না। প্রতিটি মণ্ডপের স্থানাঙ্ক মাঠপর্যায়ে নিশ্চিত করা হয়। যে সকল মণ্ডপের অবস্থান যাচাই সম্পন্ন হয়নি, সেগুলোতে নেভিগেশন স্থগিত রাখা হয় যেন দর্শনার্থীরা বিভ্রান্ত না হন।"
            : "Jagadhatri Darshan strictly adheres to content integrity. We never fabricate coordinates, travel times, visitor ratings, or unverified announcements. Unverified listings are clearly demarcated, and navigation links remain disabled until coordinates are authenticated by official committee records or GPS field audits."}
        </p>
        <div className="pt-2 flex items-center gap-4">
          <Link
            href="/pandals"
            className="btn-maroon-action px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>{t.hero.exploreBtn}</span>
          </Link>
          <Link
            href="/map"
            className="text-xs font-bold text-[#7a121d] hover:underline"
          >
            {t.discovery.viewFullMap}
          </Link>
        </div>
      </section>
    </div>
  );
}

