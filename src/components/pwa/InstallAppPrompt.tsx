"use client";

import React from "react";
import Image from "next/image";
import { usePWA } from "@/lib/pwa/PWAContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Download, X, Share, PlusSquare, Smartphone } from "lucide-react";

export function InstallAppPrompt() {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isDismissed,
    promptInstall,
    dismissPrompt,
    showIOSPrompt,
    setShowIOSPrompt,
  } = usePWA();
  const { language } = useLanguage();

  if (isInstalled) return null;

  return (
    <>
      {/* Non-intrusive Install Banner for Android / Desktop / Mobile */}
      {isInstallable && !isDismissed && (
        <div className="fixed bottom-20 lg:bottom-5 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#4a1810] text-[#fcfaf5] rounded-2xl p-3.5 sm:p-4 shadow-2xl border-2 border-[#d99b26]/50 flex items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#d99b26] to-[#8b2f1e] p-0.5 shrink-0 flex items-center justify-center shadow-md">
                <div className="w-full h-full rounded-[10px] bg-[#4a1810] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/icon-192.png"
                    alt="Jagadhatri Darshan App Icon"
                    width={36}
                    height={36}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#f5ba42] truncate">
                    {language === "bn"
                      ? "জগদ্ধাত্রী দর্শন অ্যাপ"
                      : "Jagadhatri Darshan App"}
                  </h4>
                  <span className="text-[9px] bg-[#d99b26]/20 border border-[#d99b26]/40 text-[#f5ba42] font-semibold px-1.5 py-0.2 rounded-full">
                    PWA
                  </span>
                </div>
                <p className="text-[11px] text-[#ede4d1]/80 truncate mt-0.5">
                  {language === "bn"
                    ? "অফলাইনে ম্যাপ ও পরিক্রমা দেখতে ফোনে ইনস্টল করুন"
                    : "Install for offline maps & faster hopping"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={promptInstall}
                className="btn-gold-action px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "ইনস্টল" : "Install"}</span>
              </button>
              <button
                type="button"
                onClick={dismissPrompt}
                className="p-1.5 rounded-lg text-[#ede4d1]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={language === "bn" ? "বন্ধ করুন" : "Dismiss"}
                aria-label="Dismiss install prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Specific Installation Sheet */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#fffdf8] text-[#1c1917] rounded-3xl p-6 max-w-md w-full border-2 border-[#d99b26]/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede4d1]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#4a1810] text-[#f5ba42]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#4a1810]">
                    {language === "bn"
                      ? "iPhone-এ অ্যাপটি ইনস্টল করুন"
                      : "Install on your iPhone / iPad"}
                  </h3>
                  <p className="text-[11px] text-[#78716c]">
                    {language === "bn"
                      ? "Safari ব্রাউজার দিয়ে হোম স্ক্রিনে যোগ করুন"
                      : "Add to Home Screen via Safari"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSPrompt(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-3 text-xs text-[#57534e]">
              <li className="flex items-start gap-3 bg-[#fcfaf5] p-3 rounded-xl border border-[#ede4d1]">
                <div className="w-6 h-6 rounded-full bg-[#8b2f1e] text-[#f5ba42] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-semibold text-[#1c1917] flex items-center gap-1">
                    {language === "bn"
                      ? "Safari-এর 'Share' বাটনে ট্যাপ করুন"
                      : "Tap the Safari 'Share' button"}
                    <Share className="w-3.5 h-3.5 text-blue-600 inline" />
                  </span>
                  <p className="text-[11px] text-[#78716c] mt-0.5">
                    {language === "bn"
                      ? "স্ক্রিনের নিচে (বা উপরে) থাকা শেয়ার আইকনটি চাপুন।"
                      : "Look at the bottom toolbar of Safari for the square with an arrow."}
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-[#fcfaf5] p-3 rounded-xl border border-[#ede4d1]">
                <div className="w-6 h-6 rounded-full bg-[#8b2f1e] text-[#f5ba42] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-semibold text-[#1c1917] flex items-center gap-1">
                    {language === "bn"
                      ? "'Add to Home Screen' বেছে নিন"
                      : "Select 'Add to Home Screen'"}
                    <PlusSquare className="w-3.5 h-3.5 text-stone-700 inline" />
                  </span>
                  <p className="text-[11px] text-[#78716c] mt-0.5">
                    {language === "bn"
                      ? "তালিকায় নিচের দিকে স্ক্রোল করে 'Add to Home Screen' চাপুন।"
                      : "Scroll down the menu list and tap 'Add to Home Screen'."}
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-[#fcfaf5] p-3 rounded-xl border border-[#ede4d1]">
                <div className="w-6 h-6 rounded-full bg-[#8b2f1e] text-[#f5ba42] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-semibold text-[#1c1917]">
                    {language === "bn"
                      ? "উপরে 'Add' বাটনে চাপ দিন"
                      : "Tap 'Add' on the top right"}
                  </span>
                  <p className="text-[11px] text-[#78716c] mt-0.5">
                    {language === "bn"
                      ? "অ্যাপটি হোম স্ক্রিনে চলে আসবে এবং যেকোনো সময় অফলাইনে খুলবে!"
                      : "The app icon will appear on your Home Screen for instant offline access!"}
                  </p>
                </div>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSPrompt(false)}
              className="w-full py-2.5 rounded-xl bg-[#8b2f1e] text-white font-bold text-xs hover:bg-[#a33b25] transition-colors"
            >
              {language === "bn" ? "বুঝেছি" : "Got it!"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
