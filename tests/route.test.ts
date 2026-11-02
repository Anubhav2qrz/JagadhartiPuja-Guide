import { describe, it, expect } from "vitest";
import {
  chunkRouteForGoogleMaps,
  getGoogleMapsMultiStopUrl,
  MAX_GOOGLE_MAPS_WAYPOINTS,
} from "../src/lib/maps";

describe("Multi-Stop Hopping Route Engine", () => {
  const stops = [
    { latitude: 23.4072, longitude: 88.5028 }, // Chasapara Buri Maa
    { latitude: 23.4024, longitude: 88.4947 }, // Rajbari
    { latitude: 23.4089, longitude: 88.5042 }, // Golapatti
    { latitude: 23.4115, longitude: 88.4996 }, // Hatarpara
  ];

  it("builds a single navigation URL for 4 stops without exceeding waypoint limits", () => {
    const origin = stops[0];
    const destination = stops[stops.length - 1];
    const waypoints = stops.slice(1, stops.length - 1);

    expect(waypoints.length).toBeLessThanOrEqual(MAX_GOOGLE_MAPS_WAYPOINTS);

    const url = getGoogleMapsMultiStopUrl({
      origin,
      destination,
      waypoints,
      travelMode: "walking",
    });

    expect(url).toContain("https://www.google.com/maps/dir/");
    expect(url).toContain("destination=23.4115%2C88.4996");
    expect(url).toContain("origin=23.4072%2C88.5028");
    expect(url).toContain("travelmode=walking");
  });

  it("safely segments routes that exceed the 10-stop Google Maps URL limit", () => {
    // Generate 25 stops
    const longHop = Array.from({ length: 25 }, (_, idx) => ({
      latitude: 23.4 + idx * 0.001,
      longitude: 88.5 + idx * 0.001,
    }));

    const segments = chunkRouteForGoogleMaps(longHop, null, "walking");

    // 25 stops chunked by 9 stops = 3 segments
    expect(segments.length).toBe(3);
    segments.forEach((seg, i) => {
      expect(seg.segmentIndex).toBe(i + 1);
      expect(seg.totalSegments).toBe(3);
      expect(seg.waypoints.length).toBeLessThanOrEqual(
        MAX_GOOGLE_MAPS_WAYPOINTS
      );
      expect(seg.url).toContain("https://www.google.com/maps/dir/");
    });

    // Check chaining: Segment 2 origin is Segment 1 destination
    expect(segments[1].origin).toEqual(segments[0].destination);
    expect(segments[2].origin).toEqual(segments[1].destination);
  });
});

