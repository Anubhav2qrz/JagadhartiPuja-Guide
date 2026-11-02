"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { isValidCoordinate } from "@/lib/maps";

const pickerIcon = L.divIcon({
  html: `
    <div style="
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));
    ">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="#8b2f1e" stroke="#ffffff" stroke-width="2">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="3" fill="#ffffff"/>
      </svg>
    </div>
  `,
  className: "custom-picker-pin",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function ClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function PanToCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.panTo(center);
  }, [center, map]);
  return null;
}

interface AdminMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

export default function AdminMapPickerInner({
  latitude,
  longitude,
  onChange,
}: AdminMapPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasValidPoint =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    isValidCoordinate(latitude, longitude);

  const center: [number, number] = hasValidPoint
    ? [latitude, longitude]
    : [23.4045, 88.5015];

  if (!mounted) {
    return <div className="w-full h-72 rounded-xl bg-stone-100 border border-[#ede4d1]" />;
  }

  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden border border-[#ede4d1]">
      <MapContainer
        key="admin-map-picker-container"
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PanToCenter center={center} />
        <ClickHandler
          onSelect={(lat, lng) => {
            const roundedLat = Math.round(lat * 100000) / 100000;
            const roundedLng = Math.round(lng * 100000) / 100000;
            onChange(roundedLat, roundedLng);
          }}
        />
        {hasValidPoint && (
          <Marker position={[latitude, longitude]} icon={pickerIcon} />
        )}
      </MapContainer>
      <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none">
        <div className="bg-black/75 backdrop-blur-xs text-white text-[11px] px-3 py-1.5 rounded-lg text-center shadow-md">
          {hasValidPoint
            ? `Selected: ${latitude?.toFixed(5)}, ${longitude?.toFixed(5)} (Click map to change)`
            : "Click anywhere on the map to place the verified location marker."}
        </div>
      </div>
    </div>
  );
}

