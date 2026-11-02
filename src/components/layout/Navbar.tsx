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
  Sparkles,
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
    <header className="sticky top-0 z-40 bg-[#5e0c15] text-[#fcfaf5] shadow-md border-b border-[#c59b27]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#c59b27] via-[#e6be58] to-[#9e7914] flex items-center justify-center shadow-inner text-[#5e0c15] font-serif font-bold text-lg sm:text-xl border border-[#f3d47d]/40 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg sm:text-2xl tracking-tight text-[#fcfaf5]">
                  {t.appName}
                </span>
                <span className="text-[10px] font-semibold bg-[#c59b27] text-[#1c1917] px-1.5 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block">
                  2026
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#e6be58] font-medium">
                <MapPin className="w-3 h-3 text-[#e6be58]" />
                <span>{t.locationLabel}</span>
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
                      ? "bg-[#7a121d] text-[#e6be58] shadow-sm font-semibold border border-[#c59b27]/30"
                      : "text-[#fcfaf5]/85 hover:text-[#fcfaf5] hover:bg-[#7a121d]/60"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className="bg-[#c59b27] text-[#1c1917] text-xs font-bold px-1.5 py-0.2 rounded-full min-w-5 text-center leading-4">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Language Switcher + Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#c59b27]/40 bg-[#7a121d]/70 hover:bg-[#7a121d] text-xs sm:text-sm font-medium text-[#fcfaf5] transition-all cursor-pointer shadow-sm"
              title={
                language === "en"
                  ? "বাংলা ভাষায় পরিবর্তন করুন"
                  : "Switch to English"
              }
              aria-label="Toggle language"
            >
              <Languages className="w-4 h-4 text-[#e6be58]" />
              <span className="font-semibold text-[#e6be58]">
                {language === "en" ? "বাংলা" : "EN"}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#fcfaf5] hover:bg-[#7a121d] focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#500710] border-t border-[#c59b27]/30 px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top duration-150">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? "bg-[#7a121d] text-[#e6be58] font-bold border-l-4 border-[#c59b27]"
                    : "text-[#fcfaf5]/90 hover:bg-[#7a121d]/50"
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className="bg-[#c59b27] text-[#1c1917] text-xs font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

