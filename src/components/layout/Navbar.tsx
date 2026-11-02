"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRoutePlanner } from "@/lib/route-planner/RoutePlannerContext";
import {
  Compass,
  MapPin,
  Route,
  UtensilsCrossed,
  Info,
  Menu,
  X,
  Languages,
  ShieldCheck,
  Flame,
  MessageCircle,
} from "lucide-react";

export function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const { selectedPandalIds } = useRoutePlanner();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/pandals", label: t.nav.explore },
    { href: "/map", label: t.nav.map },
    {
      href: "/route-planner",
      label: t.nav.route,
      badge: selectedPandalIds.length > 0 ? selectedPandalIds.length : undefined,
    },
    { href: "/essentials", label: t.nav.essentials },
    { href: "/about", label: t.nav.about },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className="sticky top-0 z-40 bg-[#4a1810] text-[#fcfaf5] shadow-md border-b border-[#d99b26]/30"
      style={{
        paddingTop: "max(0.5rem, env(safe-area-inset-top, 0px))",
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4rem] sm:min-h-20 py-2 sm:py-0">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none min-w-0 mr-2"
          >
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#d99b26] via-[#f5ba42] to-[#b07812] flex items-center justify-center shadow-inner text-[#4a1810] font-serif font-bold text-base sm:text-xl border border-[#fae19c]/40 group-hover:scale-105 transition-transform shrink-0">
              <Flame className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
                <span className="font-serif font-bold text-[15px] sm:text-2xl tracking-tight text-[#fcfaf5] truncate block leading-snug">
                  {t.appName}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold bg-[#d99b26] text-[#1c1917] px-1 py-0.5 rounded uppercase tracking-wider shrink-0 leading-none">
                  2026
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#f5ba42] font-medium truncate mt-0.5 leading-none">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#f5ba42] shrink-0" />
                <span className="truncate">
                  {language === "bn" ? "কৃষ্ণনগর, নদিয়া" : "Krishnanagar"}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-[#8b2f1e] text-[#f5ba42] shadow-sm font-semibold border border-[#d99b26]/30"
                      : "text-[#fcfaf5]/85 hover:text-[#fcfaf5] hover:bg-[#8b2f1e]/60"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className="bg-[#d99b26] text-[#1c1917] text-xs font-bold px-1.5 py-0.2 rounded-full min-w-5 text-center leading-4">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Language Switcher + Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-lg border border-[#d99b26]/40 bg-[#8b2f1e]/70 hover:bg-[#8b2f1e] text-xs sm:text-sm font-medium text-[#fcfaf5] transition-all cursor-pointer shadow-sm active:scale-95"
              title={
                language === "en"
                  ? "বাংলা ভাষায় পরিবর্তন করুন"
                  : "Switch to English"
              }
              aria-label="Toggle language"
            >
              <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f5ba42]" />
              <span className="font-semibold text-[#f5ba42] text-[11px] sm:text-xs">
                {language === "en" ? "বাংলা" : "EN"}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-[#fcfaf5] hover:bg-[#8b2f1e] focus:outline-none cursor-pointer active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#500710] border-t border-[#d99b26]/30 px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top duration-150">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? "bg-[#8b2f1e] text-[#f5ba42] font-bold border-l-4 border-[#d99b26]"
                    : "text-[#fcfaf5]/90 hover:bg-[#8b2f1e]/50"
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className="bg-[#d99b26] text-[#1c1917] text-xs font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Mobile Direct WhatsApp Helpline */}
          <div className="pt-3 mt-2 border-t border-[#d99b26]/20">
            <a
              href="https://wa.me/917001919941?text=Hello!%20I%20need%20assistance%20with%20the%20Jagadhatri%20Darshan%20Krishnanagar%20Guide."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-[#25D366] text-white font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {language === "bn"
                  ? "হোয়াটসঅ্যাপ সাপোর্ট (+91 70019 19941)"
                  : "WhatsApp Support (+91 70019 19941)"}
              </span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

