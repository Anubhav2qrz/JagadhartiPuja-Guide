"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CorrectionModal } from "@/components/feedback/CorrectionModal";
import {
  Flame,
  MapPin,
  Heart,
  PhoneCall,
  ShieldCheck,
  FileEdit,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

export function Footer() {
  const { t, language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#1c1917] text-[#ede4d1] border-t-4 border-[#d99b26] pt-12 pb-24 lg:pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Column 1: Brand & Cultural Tribute */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d99b26] to-[#b07812] flex items-center justify-center text-[#4a1810] font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#fcfaf5]">
                  {t.appName}
                </h3>
              </div>
              <p className="text-xs text-[#a8a29e] leading-relaxed">
                {language === "bn"
                  ? "কৃষ্ণনগর জগদ্ধাত্রী পূজা নদিয়া জেলার অহংকার। ১৭৬২ সালে মহারাজা কৃষ্ণচন্দ্র রায় প্রবর্তিত এই পবিত্র উৎসবের ডিজিটাল সহায়িকা।"
                  : "The official heritage & pandal hopping navigation guide for Krishnanagar Jagadhatri Puja, celebrating centuries of devotion founded by Maharaja Krishna Chandra Roy in 1762."}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#d99b26] pt-1 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                <span>Krishnanagar, Nadia, West Bengal, India</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#fcfaf5] uppercase tracking-wider mb-3">
                {language === "bn" ? "দ্রুত লিংক" : "Explore"}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/pandals"
                    className="hover:text-[#f5ba42] transition-colors"
                  >
                    {t.nav.explore}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/map"
                    className="hover:text-[#f5ba42] transition-colors"
                  >
                    {t.nav.map}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/route-planner"
                    className="hover:text-[#f5ba42] transition-colors"
                  >
                    {t.nav.route}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/essentials"
                    className="hover:text-[#f5ba42] transition-colors"
                  >
                    {t.nav.essentials}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-[#f5ba42] transition-colors"
                  >
                    {t.nav.about}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Emergency & Visitor Helplines */}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#fcfaf5] uppercase tracking-wider mb-3">
                {language === "bn" ? "জরুরি সহায়তা" : "Emergency Helplines"}
              </h4>
              <div className="space-y-2 text-xs text-[#a8a29e]">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#f5ba42]" />
                  <span>Krishnanagar Police Control: 100 / 03472-252222</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#f5ba42]" />
                  <span>District Sadar Hospital: 03472-252300</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#f5ba42]" />
                  <span>Ambulance Emergency: 102 / 108</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#f5ba42]" />
                  <span>Fire Brigade: 101 / 03472-252101</span>
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/917001919941?text=Hello!%20I%20need%20assistance%20with%20the%20Jagadhatri%20Darshan%20Krishnanagar%20Guide."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Support: +91 70019 19941</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 4: Content Integrity & Community Submission */}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#fcfaf5] uppercase tracking-wider mb-3">
                {language === "bn" ? "তথ্য নিষ্ঠা ও সংশোধন" : "Integrity & Updates"}
              </h4>
              <p className="text-xs text-[#a8a29e] mb-3 leading-relaxed">
                {language === "bn"
                  ? "সকল মণ্ডপের অবস্থান ও সময়সূচি যাচাইকৃত। কোনো তথ্যে অসঙ্গতি দেখলে সরাসরি আমাদের জানান।"
                  : "All destination coordinates and schedules are verified. Notice a discrepancy or timing change?"}
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-[#8b2f1e] hover:bg-[#a33b25] text-[#fcfaf5] border border-[#d99b26]/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5 text-[#f5ba42]" />
                <span>{t.actions.reportCorrection}</span>
              </button>
            </div>
          </div>

          {/* Alpana Divider */}
          <div className="alpana-divider mb-6" />

          {/* Attribution & Legal */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78716c] gap-3">
            <div>
              &copy; 2026 Jagadhatri Darshan Krishnanagar.
              All cultural heritage rights respectfully acknowledged.
            </div>
            <div className="flex items-center gap-4">
              <span>
                Map tiles &copy;{" "}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#ede4d1]"
                >
                  OpenStreetMap
                </a>{" "}
                contributors
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Community Correction Modal */}
      <CorrectionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
