import { describe, it, expect } from "vitest";
import {
  getKrishnanagarAddressSuggestions,
  searchAddressGeocode,
  normalizeQuery,
} from "@/lib/geocoding";

describe("Google Maps Address Autocomplete Engine", () => {
  it("normalizes phonetics and transliterations", () => {
    expect(normalizeQuery("Burima Chashapara")).toBe("burima chasapara");
    expect(normalizeQuery("Boubazar")).toBe("boubazar");
    expect(normalizeQuery("Bowbazar")).toBe("boubazar");
  });

  it("returns Chasapara Buri Maa for 'Burima chashapara'", async () => {
    const results = await getKrishnanagarAddressSuggestions("Burima chashapara");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("Chasapara Buri Maa");
    expect(results[0].latitude).toBeCloseTo(23.410188, 3);
    expect(results[0].longitude).toBeCloseTo(88.496313, 3);
  });

  it("returns Chasapara Buri Maa for 'burima'", async () => {
    const results = await getKrishnanagarAddressSuggestions("burima");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("Chasapara Buri Maa");
  });

  it("returns Krishnanagar Rajbari for 'rajbari'", async () => {
    const results = await getKrishnanagarAddressSuggestions("rajbari");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("Krishnanagar Rajbari");
  });

  it("returns Adhar Chandra Das for 'sarpuria' or 'adhar'", async () => {
    const results = await getKrishnanagarAddressSuggestions("sarpuria");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("Adhar Chandra Das");
  });

  it("returns Bowbazar for 'boubazar'", async () => {
    const results = await getKrishnanagarAddressSuggestions("boubazar");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("Bowbazar");
  });

  it("returns popular landmarks when query is empty", async () => {
    const results = await getKrishnanagarAddressSuggestions("");
    expect(results.length).toBeGreaterThanOrEqual(5);
  });

  it("recognizes pasted raw latitude and longitude coordinates", async () => {
    const results = await getKrishnanagarAddressSuggestions(
      "23.407200, 88.502800"
    );
    expect(results.length).toBe(1);
    expect(results[0].latitude).toBe(23.4072);
    expect(results[0].longitude).toBe(88.5028);
    expect(results[0].categoryLabel).toBe("Direct GPS Coordinates");
  });
});
