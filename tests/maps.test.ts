import { describe, it, expect } from "vitest";
import {
  isValidCoordinate,
  isKrishnanagarVicinity,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsMultiStopUrl,
  chunkRouteForGoogleMaps,
  calculateHaversineDistanceKm,
  MAX_GOOGLE_MAPS_WAYPOINTS,
} from "../src/lib/maps";

describe("Coordinate Validation", () => {
  it("validates correct geographic coordinates", () => {
    expect(isValidCoordinate(23.4013, 88.4965)).toBe(true);
    expect(isValidCoordinate(0, 0)).toBe(true);
    expect(isValidCoordinate(90, 180)).toBe(true);
    expect(isValidCoordinate(-90, -180)).toBe(true);
  });

  it("rejects out-of-range coordinates", () => {
    expect(isValidCoordinate(91, 50)).toBe(false);
    expect(isValidCoordinate(-91, 50)).toBe(false);
    expect(isValidCoordinate(23, 181)).toBe(false);
    expect(isValidCoordinate(23, -181)).toBe(false);
  });

  it("rejects non-numeric or infinite values", () => {
    expect(isValidCoordinate(NaN, 88.49)).toBe(false);
    expect(isValidCoordinate(23.4, Infinity)).toBe(false);
    expect(isValidCoordinate(undefined, 88.49)).toBe(false);
    expect(isValidCoordinate("23.4", "88.49")).toBe(false);
    expect(isValidCoordinate(null, null)).toBe(false);
  });

  it("checks Krishnanagar vicinity correctly", () => {
    // Krishnanagar center
    expect(isKrishnanagarVicinity(23.4013, 88.4965)).toBe(true);
    // Chasapara
    expect(isKrishnanagarVicinity(23.405, 88.502)).toBe(true);
    // Kolkata (outside Krishnanagar)
    expect(isKrishnanagarVicinity(22.5726, 88.3639)).toBe(false);
    // Delhi (far away)
    expect(isKrishnanagarVicinity(28.6139, 77.209)).toBe(false);
  });
});

describe("Google Maps Directions URL Generator", () => {
  it("generates correct single destination URL without origin (device location prompt)", () => {
    const url = getGoogleMapsDirectionsUrl({
      destination: { latitude: 23.4013, longitude: 88.4965 },
    });

    expect(url).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=23.4013%2C88.4965"
    );
  });

  it("includes origin and travel mode when provided", () => {
    const url = getGoogleMapsDirectionsUrl({
      destination: { latitude: 23.4013, longitude: 88.4965 },
      origin: { latitude: 23.395, longitude: 88.485 },
      travelMode: "walking",
    });

    const parsed = new URL(url);
    expect(parsed.origin).toBe("https://www.google.com");
    expect(parsed.pathname).toBe("/maps/dir/");
    expect(parsed.searchParams.get("api")).toBe("1");
    expect(parsed.searchParams.get("destination")).toBe("23.4013,88.4965");
    expect(parsed.searchParams.get("origin")).toBe("23.395,88.485");
    expect(parsed.searchParams.get("travelmode")).toBe("walking");
  });

  it("throws descriptive error when destination coordinates are invalid", () => {
    expect(() =>
      getGoogleMapsDirectionsUrl({
        destination: { latitude: 999, longitude: 88.4965 },
      })
    ).toThrowError(/Destination coordinates are missing or invalid/);
  });
});

describe("Google Maps Multi-Stop URL Generator", () => {
  const buriMaa = { latitude: 23.405, longitude: 88.502 };
  const rajbari = { latitude: 23.402, longitude: 88.495 };
  const golapatti = { latitude: 23.408, longitude: 88.506 };
  const hatarpara = { latitude: 23.409, longitude: 88.498 };

  it("generates multi-stop URL with waypoints", () => {
    const url = getGoogleMapsMultiStopUrl({
      origin: buriMaa,
      destination: hatarpara,
      waypoints: [rajbari, golapatti],
      travelMode: "walking",
    });

    const parsed = new URL(url);
    expect(parsed.searchParams.get("api")).toBe("1");
    expect(parsed.searchParams.get("origin")).toBe("23.405,88.502");
    expect(parsed.searchParams.get("destination")).toBe("23.409,88.498");
    expect(parsed.searchParams.get("waypoints")).toBe(
      "23.402,88.495|23.408,88.506"
    );
    expect(parsed.searchParams.get("travelmode")).toBe("walking");
  });

  it("enforces maximum waypoint limit of 8", () => {
    const excessiveWaypoints = Array(9).fill({
      latitude: 23.4,
      longitude: 88.5,
    });

    expect(() =>
      getGoogleMapsMultiStopUrl({
        destination: hatarpara,
        waypoints: excessiveWaypoints,
      })
    ).toThrowError(/Waypoint count \(9\) exceeds Google Maps limit of 8/);
  });
});

describe("Route Segment Chunker for Extended Itineraries", () => {
  it("chunks a long 15-stop route into safe Google Maps segments", () => {
    const dummyStops = Array.from({ length: 15 }, (_, i) => ({
      latitude: 23.4 + i * 0.001,
      longitude: 88.5 + i * 0.001,
    }));

    const segments = chunkRouteForGoogleMaps(dummyStops, null, "walking");

    // 15 stops should produce 2 segments because max per chunk is 9
    expect(segments.length).toBe(2);
    expect(segments[0].segmentIndex).toBe(1);
    expect(segments[0].totalSegments).toBe(2);
    expect(segments[0].waypoints.length).toBeLessThanOrEqual(
      MAX_GOOGLE_MAPS_WAYPOINTS
    );
    expect(segments[1].waypoints.length).toBeLessThanOrEqual(
      MAX_GOOGLE_MAPS_WAYPOINTS
    );

    // Segment 2 origin should connect with Segment 1 destination
    expect(segments[1].origin).toEqual(segments[0].destination);
  });
});

describe("Haversine Distance Calculator", () => {
  it("calculates accurate distance between known coordinates", () => {
    // Distance between Chasapara (~23.405, 88.502) and Rajbari (~23.402, 88.495) is approx 0.7 - 0.8 km
    const dist = calculateHaversineDistanceKm(
      { latitude: 23.405, longitude: 88.502 },
      { latitude: 23.402, longitude: 88.495 }
    );
    expect(dist).toBeGreaterThan(0.5);
    expect(dist).toBeLessThan(1.5);
  });
});

