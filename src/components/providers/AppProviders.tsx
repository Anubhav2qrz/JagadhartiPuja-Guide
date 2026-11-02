"use client";

import React from "react";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { FavoritesProvider } from "@/lib/favorites/FavoritesContext";
import { RoutePlannerProvider } from "@/lib/route-planner/RoutePlannerContext";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/support/WhatsAppButton";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <RoutePlannerProvider>
          <div className="min-h-screen flex flex-col bg-[#fcfaf5] text-[#1c1917] selection:bg-[#c59b27]/30 selection:text-[#5e0c15]">
            <Navbar />
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>
            <Footer />
            <WhatsAppButton />
            <BottomNav />
          </div>
        </RoutePlannerProvider>
      </FavoritesProvider>
    </LanguageProvider>
  );
}

