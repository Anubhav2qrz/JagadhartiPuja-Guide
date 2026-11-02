"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

interface AdminMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

const DynamicPicker = dynamic(
  () => import("./AdminMapPickerInner"),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-72 rounded-xl" />,
  }
);

export function AdminMapPicker(props: AdminMapPickerProps) {
  return <DynamicPicker {...props} />;
}

