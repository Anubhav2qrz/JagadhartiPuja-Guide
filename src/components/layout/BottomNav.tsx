"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRoutePlanner } from "@/lib/route-planner/RoutePlannerContext";
import { Home, Compass, Map, Route } from "lucide-react";

export function BottomNav() {
  const { t } = useLanguage();
  const { selectedPandalIds } = useRoutePlanner();
  const pathname = usePathname();

  const items = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/pandals", label: t.nav.explore, icon: Compass },
    { href: "/map", label: t.nav.map, icon: Map },
    {
      href: "/route-planner",
      label: t.nav.myRoute,
      icon: Route,
      badge: selectedPandalIds.length > 0 ? selectedPandalIds.length : undefined,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#4a1810] text-[#fcfaf5] border-t border-[#d99b26]/30 shadow-2xl pb-safe">
      <div className="grid grid-cols-4 h-16 items-center px-1">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 relative transition-colors ${
                active
                  ? "text-[#f5ba42] font-bold"
                  : "text-[#fcfaf5]/70 hover:text-[#fcfaf5]"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#d99b26] text-[#1c1917] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center leading-3">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight truncate max-w-full px-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

