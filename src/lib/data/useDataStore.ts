"use client";

import { useState, useEffect } from "react";
import { dataStore } from "./store";
import { Pandal, Locality, Place, Announcement } from "@/types";

export function useDataStore() {
  const [pandals, setPandals] = useState<Pandal[]>(() => dataStore.getPandals());
  const [localities, setLocalities] = useState<Locality[]>(() =>
    dataStore.getLocalities()
  );
  const [places, setPlaces] = useState<Place[]>(() => dataStore.getPlaces());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    dataStore.getAnnouncements()
  );

  useEffect(() => {
    // 1. Initial hydration on client mount
    setPandals(dataStore.getPandals());
    setLocalities(dataStore.getLocalities());
    setPlaces(dataStore.getPlaces());
    setAnnouncements(dataStore.getAnnouncements());

    // 2. Listen to custom internal update events and localStorage events
    const handleUpdate = () => {
      setPandals(dataStore.getPandals());
      setLocalities(dataStore.getLocalities());
      setPlaces(dataStore.getPlaces());
      setAnnouncements(dataStore.getAnnouncements());
    };

    window.addEventListener("jd_data_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("jd_data_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    pandals,
    localities,
    places,
    announcements,
    refresh: () => {
      setPandals(dataStore.getPandals());
      setLocalities(dataStore.getLocalities());
      setPlaces(dataStore.getPlaces());
      setAnnouncements(dataStore.getAnnouncements());
    },
  };
}

