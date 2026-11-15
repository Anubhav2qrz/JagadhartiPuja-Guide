import type { MetadataRoute } from "next";
import { SEED_PANDALS } from "@/lib/data/seed-data";

const BASE_URL = "https://krishnanagarjagadhatripuja.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // 1. Core Top-Level Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pandals`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/route-planner`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/traditions`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/essentials`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. Individual Pandal Detail Pages (Dynamic SEO)
  const pandalRoutes: MetadataRoute.Sitemap = SEED_PANDALS.map((pandal) => ({
    url: `${BASE_URL}/pandals/${pandal.slug}`,
    lastModified: pandal.updated_at ? new Date(pandal.updated_at) : currentDate,
    changeFrequency: "weekly",
    priority: pandal.is_featured ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...pandalRoutes];
}

