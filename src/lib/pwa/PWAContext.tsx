"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isDismissed: boolean;
  promptInstall: () => Promise<boolean>;
  dismissPrompt: () => void;
  showIOSPrompt: boolean;
  setShowIOSPrompt: (val: boolean) => void;
}

const PWAContext = createContext<PWAContextType | null>(null);

const DISMISS_KEY = "jd_pwa_install_dismissed_until";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [showIOSPrompt, setShowIOSPrompt] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register Service Worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    }

    // 2. Check if already installed (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari =
      isAppleDevice &&
      /safari/.test(ua) &&
      !/crios|fxios|optios|edgios/.test(ua);

    setIsIOS(Boolean(isAppleDevice && isSafari));

    // 4. Check if dismissed recently (24 hours cooldown)
    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (!dismissedUntil || Date.now() > Number(dismissedUntil)) {
      setIsDismissed(false);
    }

    // 5. Capture beforeinstallprompt for Android Chrome / Edge / Desktop Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 6. Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    }

    if (isIOS) {
      setShowIOSPrompt(true);
      return false;
    }

    return false;
  }, [deferredPrompt, isIOS]);

  const dismissPrompt = useCallback(() => {
    setIsDismissed(true);
    // Dismiss for 24 hours
    try {
      localStorage.setItem(
        DISMISS_KEY,
        String(Date.now() + 24 * 60 * 60 * 1000)
      );
    } catch {
      // ignore
    }
  }, []);

  return (
    <PWAContext.Provider
      value={{
        isInstallable: Boolean(deferredPrompt) || (isIOS && !isInstalled),
        isInstalled,
        isIOS,
        isDismissed,
        promptInstall,
        dismissPrompt,
        showIOSPrompt,
        setShowIOSPrompt,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA(): PWAContextType {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
}

