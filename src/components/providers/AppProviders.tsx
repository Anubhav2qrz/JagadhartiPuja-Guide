"use client";

import React from "react";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { FavoritesProvider } from "@/lib/favorites/FavoritesContext";
import { RoutePlannerProvider } from "@/lib/route-planner/RoutePlannerContext";
import { PWAProvider } from "@/lib/pwa/PWAContext";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/support/WhatsAppButton";
import { InstallAppPrompt } from "@/components/pwa/InstallAppPrompt";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <RoutePlannerProvider>
          <PWAProvider>
            <div className="min-h-screen flex flex-col bg-[#fcfaf5] text-[#1c1917] selection:bg-[#d99b26]/30 selection:text-[#4a1810]">
              <Navbar />
              <main className="flex-1 pb-20 lg:pb-0">{children}</main>
              <Footer />
              <WhatsAppButton />
              <InstallAppPrompt />
              <BottomNav />
            </div>
          </PWAProvider>
        </RoutePlannerProvider>
      </FavoritesProvider>
    </LanguageProvider>
  );
}

