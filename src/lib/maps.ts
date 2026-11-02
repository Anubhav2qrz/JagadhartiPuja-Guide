/**
 * Google Maps Directions URL Generation and Coordinate Validation Utilities
 * 
 * Complies with Google Maps Directions URL specifications:
 * https://developers.google.com/maps/documentation/urls/get-started#directions-action
 */

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export type TravelMode = "walking" | "driving" | "transit" | "bicycling";

export interface SingleDestinationDirectionsOptions {
  destination: Coordinate;
  origin?: Coordinate | null;
  travelMode?: TravelMode;
}

export interface MultiStopDirectionsOptions {
  origin?: Coordinate | null;
  destination: Coordinate;
  waypoints?: Coordinate[];
  travelMode?: TravelMode;
}

export interface RouteSegment {
  origin?: Coordinate | null;
  destination: Coordinate;
  waypoints: Coordinate[];
  segmentIndex: number;
  totalSegments: number;
  url: string;
}

/**
 * Validates whether latitude and longitude are valid geographic coordinates.
 * Latitude must be between -90 and 90, Longitude between -180 and 180.
 * Also checks that numbers are finite and not NaN.
 */
export function isValidCoordinate(
  latitude: unknown,
  longitude: unknown
): latitude is number {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return false;
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false;
  }
  if (latitude < -90 || latitude > 90) {
    return false;
  }
  if (longitude < -180 || longitude > 180) {
    return false;
  }
  return true;
}

/**
 * Checks if coordinates are within the expected Krishnanagar / Nadia region.
 * Krishnanagar is roughly around lat: 23.35 - 23.45, lng: 88.45 - 88.55.
 * Useful for warnings when admin enters a suspicious point.
 */
export function isKrishnanagarVicinity(latitude: number, longitude: number): boolean {
  return (
    latitude >= 23.2 &&
    latitude <= 23.6 &&
    longitude >= 88.3 &&
    longitude <= 88.7
  );
}

/**
 * Formats coordinates into standard "lat,lng" string.
 */
export function formatCoordinates(coord: Coordinate): string {
  if (!isValidCoordinate(coord.latitude, coord.longitude)) {
    throw new Error(
      `Invalid coordinates provided: latitude ${coord.latitude}, longitude ${coord.longitude}`
    );
  }
  return `${coord.latitude},${coord.longitude}`;
}

/**
 * Generates standard single-destination Google Maps Directions URL.
 * Pattern: https://www.google.com/maps/dir/?api=1&destination=LATITUDE%2CLONGITUDE
 * 
 * If origin is omitted (or user denied geolocation), Google Maps will automatically
 * prompt or use the device's current location.
 */
export function getGoogleMapsDirectionsUrl(
  options: SingleDestinationDirectionsOptions
): string {
  const { destination, origin, travelMode } = options;

  if (!destination || !isValidCoordinate(destination.latitude, destination.longitude)) {
    throw new Error("Cannot generate directions URL: Destination coordinates are missing or invalid.");
  }

  const params = new URLSearchParams({
    api: "1",
    destination: formatCoordinates(destination),
  });

  if (origin && isValidCoordinate(origin.latitude, origin.longitude)) {
    params.set("origin", formatCoordinates(origin));
  }

  if (travelMode) {
    params.set("travelmode", travelMode);
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * Google Maps Directions URLs have a limit on waypoints.
 * Standard URL limit is up to 8-9 intermediate waypoints between origin and destination (max 10 total stops).
 */
export const MAX_GOOGLE_MAPS_WAYPOINTS = 8;
export const MAX_TOTAL_STOPS_PER_URL = 10;

/**
 * Generates multi-stop Google Maps Directions URL with waypoints.
 * Example: https://www.google.com/maps/dir/?api=1&origin=...&destination=...&waypoints=lat1,lng1%7Clat2,lng2
 */
export function getGoogleMapsMultiStopUrl(
  options: MultiStopDirectionsOptions
): string {
  const { destination, origin, waypoints = [], travelMode } = options;

  if (!destination || !isValidCoordinate(destination.latitude, destination.longitude)) {
    throw new Error("Cannot generate multi-stop URL: Destination coordinates are invalid.");
  }

  const params = new URLSearchParams({
    api: "1",
    destination: formatCoordinates(destination),
  });

  if (origin && isValidCoordinate(origin.latitude, origin.longitude)) {
    params.set("origin", formatCoordinates(origin));
  }

  if (waypoints.length > 0) {
    // Validate each waypoint
    for (let i = 0; i < waypoints.length; i++) {
      const wp = waypoints[i];
      if (!isValidCoordinate(wp.latitude, wp.longitude)) {
        throw new Error(`Invalid waypoint at index ${i}: (${wp.latitude}, ${wp.longitude})`);
      }
    }

    if (waypoints.length > MAX_GOOGLE_MAPS_WAYPOINTS) {
      throw new Error(
        `Waypoint count (${waypoints.length}) exceeds Google Maps limit of ${MAX_GOOGLE_MAPS_WAYPOINTS}. Please split into route segments.`
      );
    }

    // Waypoints are joined by pipe '|' and URL-encoded
    const waypointsString = waypoints
      .map((wp) => `${wp.latitude},${wp.longitude}`)
      .join("|");

    params.set("waypoints", waypointsString);
  }

  if (travelMode) {
    params.set("travelmode", travelMode);
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * Splits a list of ordered stops into chunks that fit within Google Maps waypoint limits.
 * Each segment continues from the last stop of the previous segment.
 */
export function chunkRouteForGoogleMaps(
  stops: Coordinate[],
  origin?: Coordinate | null,
  travelMode: TravelMode = "walking"
): RouteSegment[] {
  if (stops.length === 0) {
    return [];
  }

  // If we have an origin, total stops = origin + stops
  // If no origin, total stops = stops (first stop is origin if length > 1, or destination if length 1)
  
  if (stops.length === 1) {
    return [
      {
        origin: origin || null,
        destination: stops[0],
        waypoints: [],
        segmentIndex: 1,
        totalSegments: 1,
        url: getGoogleMapsDirectionsUrl({
          origin,
          destination: stops[0],
          travelMode,
        }),
      },
    ];
  }

  const segments: RouteSegment[] = [];
  let currentOrigin = origin || stops[0];
  const stopQueue = origin ? [...stops] : stops.slice(1);

  // Each segment can take up to 8 waypoints + 1 destination = 9 stops from currentOrigin
  const CHUNK_SIZE = 9;

  for (let i = 0; i < stopQueue.length; i += CHUNK_SIZE) {
    const chunk = stopQueue.slice(i, i + CHUNK_SIZE);
    const dest = chunk[chunk.length - 1];
    const waypoints = chunk.slice(0, chunk.length - 1);

    segments.push({
      origin: currentOrigin,
      destination: dest,
      waypoints,
      segmentIndex: segments.length + 1,
      totalSegments: 1, // Will update below
      url: getGoogleMapsMultiStopUrl({
        origin: currentOrigin,
        destination: dest,
        waypoints,
        travelMode,
      }),
    });

    currentOrigin = dest;
  }

  // Update totalSegments
  segments.forEach((s) => (s.totalSegments = segments.length));

  return segments;
}

/**
 * Calculates straight-line distance in kilometers between two coordinates
 * using the Haversine formula. (For reference and ordering only).
 */
export function calculateHaversineDistanceKm(
  coord1: Coordinate,
  coord2: Coordinate
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

