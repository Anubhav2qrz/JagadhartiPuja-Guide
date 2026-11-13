"use client";

import React from "react";
import { usePWA } from "@/lib/pwa/PWAContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Download } from "lucide-react";

export function InstallAppNavButton({
  isMobileDrawer = false,
}: {
  isMobileDrawer?: boolean;
}) {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const { language } = useLanguage();

  if (isInstalled || !isInstallable) return null;

  if (isMobileDrawer) {
    return (
      <button
        type="button"
        onClick={promptInstall}
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-base font-bold bg-[#d99b26]/20 text-[#f5ba42] border border-[#d99b26]/50 hover:bg-[#d99b26]/30 transition-all cursor-pointer active:scale-98"
      >
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-[#f5ba42]" />
          <span>
            {language === "bn" ? "অ্যাপ ইনস্টল করুন" : "Install App"}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d99b26] text-[#1c1917] px-2 py-0.5 rounded-md">
          APK / PWA
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={promptInstall}
      className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#d99b26]/20 hover:bg-[#d99b26]/30 text-[#f5ba42] border border-[#d99b26]/40 transition-all cursor-pointer active:scale-95 shadow-2xs"
      title={
        language === "bn"
          ? "ফোনে বা কম্পিউটারে অ্যাপ হিসেবে ইনস্টল করুন"
          : "Install Jagadhatri Darshan as a native app"
      }
    >
      <Download className="w-3.5 h-3.5 text-[#f5ba42]" />
      <span>{language === "bn" ? "অ্যাপ ইনস্টল" : "Install App"}</span>
    </button>
  );
}

