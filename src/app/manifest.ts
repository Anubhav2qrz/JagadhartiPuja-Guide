import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jagadhatri Darshan — Krishnanagar",
    short_name: "Jagadhatri",
    description:
      "The complete, verified guide to historic Jagadhatri Puja pandals, routes, food, and turn-by-turn navigation in Krishnanagar.",
    start_url: "/",
    display: "standalone",
    background_color: "#4a1810",
    theme_color: "#4a1810",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Explore Pandals",
        short_name: "Pandals",
        description: "Browse all verified Jagadhatri Puja pandals",
        url: "/pandals",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Interactive Map",
        short_name: "Map",
        description: "Live GPS map of Krishnanagar puja pandals",
        url: "/map",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Plan Your Route",
        short_name: "Route",
        description: "Smart hopping itinerary and auto-routing",
        url: "/route-planner",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Food & Essentials",
        short_name: "Food",
        description: "Restaurants, cafes, GI sweets and parking",
        url: "/essentials",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
    categories: ["travel", "navigation", "lifestyle", "festivals"],
  };
}
