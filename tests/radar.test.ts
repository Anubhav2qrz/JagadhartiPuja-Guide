import { describe, it, expect } from "vitest";
import { calculateHaversineDistanceKm } from "../src/lib/maps";

describe("Near Me Quick Radar Logic", () => {
  const userGpsLocation = {
    latitude: 23.403, // Near Krishnanagar center
    longitude: 88.498,
  };

  const samplePandals = [
    {
      id: "pandal-1",
      name: "Chasapara Buri Maa",
      latitude: 23.410188,
      longitude: 88.496313,
      is_verified: true,
    },
    {
      id: "pandal-2",
      name: "Rajbari Barowari",
      latitude: 23.4035,
      longitude: 88.495,
      is_verified: true,
    },
    {
      id: "pandal-3",
      name: "Far Pandal",
      latitude: 23.45,
      longitude: 88.55,
      is_verified: true,
    },
    {
      id: "pandal-unverified",
      name: "Unverified Pandal",
      latitude: 23.4031,
      longitude: 88.4981,
      is_verified: false,
    },
  ];

  it("calculates accurate distances and sorts nearest pandals first", () => {
    const verifiedWithDistances = samplePandals
      .filter((p) => p.is_verified)
      .map((p) => ({
        ...p,
        distanceKm: calculateHaversineDistanceKm(userGpsLocation, {
          latitude: p.latitude,
          longitude: p.longitude,
        }),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    expect(verifiedWithDistances.length).toBe(3);
    // Rajbari Barowari is closest to (23.403, 88.498)
    expect(verifiedWithDistances[0].id).toBe("pandal-2");
    expect(verifiedWithDistances[0].distanceKm).toBeLessThan(0.5);

    // Far pandal should be last
    expect(verifiedWithDistances[2].id).toBe("pandal-3");
    expect(verifiedWithDistances[2].distanceKm).toBeGreaterThan(5);
  });

  it("calculates realistic walking times from distances", () => {
    // 0.8 km at 4.5 km/h ≈ 10.6 minutes
    const distKm = 0.8;
    const walkingSpeedKmH = 4.5;
    const walkingMinutes = Math.max(1, Math.round((distKm / walkingSpeedKmH) * 60));
    expect(walkingMinutes).toBe(11);
  });

  it("can select the top 5 closest pandals for one-tap auto route", () => {
    const sortedPandals = samplePandals
      .filter((p) => p.is_verified)
      .map((p) => ({
        ...p,
        dist: calculateHaversineDistanceKm(userGpsLocation, {
          latitude: p.latitude,
          longitude: p.longitude,
        }),
      }))
      .sort((a, b) => a.dist - b.dist);

    const top5Ids = sortedPandals.slice(0, 5).map((p) => p.id);
    expect(top5Ids).toEqual(["pandal-2", "pandal-1", "pandal-3"]);
  });
});
