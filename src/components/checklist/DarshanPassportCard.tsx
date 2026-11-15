"use client";

import React, { useState } from "react";
import { useChecklist } from "@/lib/checklist/ChecklistContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  CheckCircle2,
  Trophy,
  Share2,
  Check,
  RotateCcw,
  Sparkles,
  Flame,
} from "lucide-react";

interface DarshanPassportCardProps {
  totalPandals?: number;
  compact?: boolean;
}

export function DarshanPassportCard({
  totalPandals = 39,
  compact = false,
}: DarshanPassportCardProps) {
  const { visitedPandalIds, visitedCount, clearVisited } = useChecklist();
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const percentage = Math.min(
    100,
    Math.round((visitedCount / Math.max(1, totalPandals)) * 100)
  );

  const getRank = () => {
    if (visitedCount === 0) {
      return {
        title: language === "bn" ? "দর্শন যাত্রা শুরু করুন" : "Begin Your Darshan",
        icon: Flame,
        color: "text-[#d99b26]",
      };
    }
    if (visitedCount < 10) {
      return {
        title: language === "bn" ? "পরিক্রমার পথে (Devotee Explorer)" : "Devotee Explorer",
        icon: Sparkles,
        color: "text-[#f5ba42]",
      };
    }
    if (visitedCount < 25) {
      return {
        title: language === "bn" ? "উৎসাহী দর্শনার্থী (Avid Hopper)" : "Avid Pandal Hopper",
        icon: Trophy,
        color: "text-amber-400",
      };
    }
    if (visitedCount < totalPandals) {
      return {
        title: language === "bn" ? "অভিজ্ঞ পরিক্রমাকারী (Krishnanagar Connoisseur)" : "Krishnanagar Connoisseur",
        icon: Trophy,
        color: "text-emerald-400",
      };
    }
    return {
      title: language === "bn" ? "মহা দর্শন সম্পন্ন! (Maha Darshan Champion 🏆)" : "Maha Darshan Champion 🏆",
      icon: Trophy,
      color: "text-yellow-300",
    };
  };

  const rank = getRank();
  const RankIcon = rank.icon;

  const handleShareProgress = async () => {
    const text =
      language === "bn"
        ? `📿 জগদ্ধাত্রী দর্শন ২০২৬: আমি কৃষ্ণনগরের ${totalPandals}টি মণ্ডপের মধ্যে ${visitedCount}টি মণ্ডপ দর্শন সম্পন্ন করেছি (${percentage}%)! আপনার দর্শন ট্র্যাক করুন: https://krishnanagarjagadhatripuja.in`
        : `📿 Jagadhatri Darshan 2026: I have visited ${visitedCount} of ${totalPandals} pandals (${percentage}%) in Krishnanagar! Track your pandal hopping journey at https://krishnanagarjagadhatripuja.in`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Krishnanagar Jagadhatri Darshan Passport",
          text,
          url: "https://krishnanagarjagadhatripuja.in",
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (compact) {
    return (
      <div className="bg-[#4a1810] text-[#fcfaf5] rounded-2xl p-4 border border-[#d99b26]/40 shadow-md space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#f5ba42]" />
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#f5ba42]">
              {language === "bn" ? "দর্শন অগ্রগতি" : "Darshan Progress"}
            </h4>
          </div>
          <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
            {visitedCount} / {totalPandals} ({percentage}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/10">
          <div
            className="bg-linear-to-r from-[#d99b26] to-[#f5ba42] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-[#4a1810] via-[#38110b] to-[#250a06] text-[#fcfaf5] rounded-3xl p-5 sm:p-7 border-2 border-[#d99b26]/50 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f5ba42]/20 border border-[#d99b26]/40 text-[#f5ba42] text-[11px] font-bold uppercase tracking-wider mb-1">
            <RankIcon className={`w-3.5 h-3.5 ${rank.color}`} />
            <span>{rank.title}</span>
          </div>
          <h3 className="font-serif font-bold text-lg sm:text-2xl text-[#f5ba42]">
            {language === "bn" ? "আমার দর্শন পাসপোর্ট ২০২৬" : "My Darshan Passport 2026"}
          </h3>
          <p className="text-xs text-[#ede4d1]/80 mt-0.5">
            {language === "bn"
              ? "মণ্ডপ ঘুরে 'দর্শন করেছি' চিহ্নিত করুন এবং আপনার পরিক্রমার ট্র্যাক রাখুন।"
              : "Check in as you hop pandals to track your spiritual journey across Krishnanagar."}
          </p>
        </div>

        {/* Actions (Share & Clear) */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleShareProgress}
            className="btn-gold-action px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            title="Share your darshan count on WhatsApp"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-950" />
                <span>{language === "bn" ? "কপি হয়েছে!" : "Copied!"}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "শেয়ার করুন" : "Share"}</span>
              </>
            )}
          </button>

          {visitedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    language === "bn"
                      ? "আপনি কি দর্শন তালিকা রিসেট করতে চান?"
                      : "Reset all visited pandals?"
                  )
                ) {
                  clearVisited();
                }
              }}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title={language === "bn" ? "তালিকা রিসেট করুন" : "Reset list"}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Milestone Statistics */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#ede4d1]/90 font-medium">
            {language === "bn"
              ? `${totalPandals}টি মণ্ডপের মধ্যে ${visitedCount}টি দর্শন সম্পন্ন`
              : `${visitedCount} of ${totalPandals} Pandals Visited`}
          </span>
          <span className="font-bold text-[#f5ba42] text-sm">{percentage}%</span>
        </div>

        {/* Outer Bar */}
        <div className="w-full bg-black/40 rounded-full h-3 p-0.5 overflow-hidden border border-white/15 shadow-inner">
          <div
            className="bg-linear-to-r from-[#d99b26] via-[#f5ba42] to-amber-300 h-full rounded-full transition-all duration-600 ease-out shadow-xs"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
