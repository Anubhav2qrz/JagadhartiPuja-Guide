import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jagadhatri Darshan — Krishnanagar Pandal Hopping Guide",
    template: "%s | Jagadhatri Darshan Krishnanagar",
  },
  description:
    "Discover Krishnanagar, One Pandal at a Time. The definitive Jagadhatri Puja guide for Krishnanagar, Nadia, West Bengal. Explore interactive maps, multi-stop hopping itineraries, and direct Google Maps navigation.",
  keywords: [
    "Krishnanagar Jagadhatri Puja",
    "Jagadhatri Darshan",
    "Chasapara Buri Maa",
    "Krishnanagar Rajbari Puja",
    "Nadia Jagadhatri Puja 2026",
    "Pandal hopping guide",
    "Krishnanagar Google Maps navigation",
  ],
  authors: [{ name: "Jagadhatri Darshan Krishnanagar" }],
  openGraph: {
    title: "Jagadhatri Darshan — Krishnanagar Pandal Hopping Guide",
    description:
      "Explore Krishnanagar's sacred and historic Jagadhatri Puja pandals with verified GPS coordinates and turn-by-turn Google Maps navigation.",
    type: "website",
    locale: "en_IN",
    siteName: "Jagadhatri Darshan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jagadhatri Darshan — Krishnanagar Pandal Hopping Guide",
    description:
      "The comprehensive, mobile-first guide to Krishnanagar Jagadhatri Puja pandals, sweets, and Google Maps directions.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jagadhatri Darshan",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#5e0c15",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
