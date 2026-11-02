import { Metadata } from "next";
import { notFound } from "next/navigation";
import { dataStore } from "@/lib/data/store";
import { SEED_PANDALS } from "@/lib/data/seed-data";
import { PandalDetailClient } from "@/components/pandal/PandalDetailClient";

interface PandalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SEED_PANDALS.map((pandal) => ({
    slug: pandal.slug,
  }));
}

export async function generateMetadata({
  params,
}: PandalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pandal = dataStore.getPandalBySlug(slug);

  if (!pandal) {
    return {
      title: "Pandal Not Found",
    };
  }

  return {
    title: `${pandal.name} (${pandal.name_bn})`,
    description: pandal.description.slice(0, 160),
    openGraph: {
      title: `${pandal.name} — Jagadhatri Darshan Krishnanagar`,
      description: pandal.description.slice(0, 160),
      images: [
        {
          url: pandal.cover_image_url,
          width: 1200,
          height: 630,
          alt: pandal.name,
        },
      ],
    },
  };
}

export default async function PandalPage({ params }: PandalPageProps) {
  const { slug } = await params;
  const pandal = dataStore.getPandalBySlug(slug);

  if (!pandal) {
    notFound();
  }

  return <PandalDetailClient pandal={pandal} />;
}
