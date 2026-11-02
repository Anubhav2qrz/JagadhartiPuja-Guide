import { describe, it, expect, beforeEach } from "vitest";
import { dataStore } from "../src/lib/data/store";

describe("DataStore & Search/Filter Operations", () => {
  beforeEach(() => {
    dataStore.resetToSeed();
  });

  it("retrieves published pandals with default seed", () => {
    const pandals = dataStore.getPandals();
    expect(pandals.length).toBeGreaterThanOrEqual(30);
    // Find Chasapara Buri Maa
    const buriMaa = pandals.find((p) => p.slug.includes("chasapara"));
    expect(buriMaa).toBeDefined();
    expect(buriMaa?.is_verified).toBe(true);
    expect(buriMaa?.latitude).toBeCloseTo(23.410188, 3);
  });

  it("filters pandals by category", () => {
    const heritage = dataStore.getPandals({ category: "heritage" });
    expect(heritage.length).toBeGreaterThanOrEqual(2);
    heritage.forEach((p) => expect(p.category).toBe("heritage"));
  });

  it("filters pandals by locality", () => {
    const chasaparaPandals = dataStore.getPandals({
      localityId: "loc-chasapara",
    });
    expect(chasaparaPandals.length).toBeGreaterThanOrEqual(1);
    chasaparaPandals.forEach((p) =>
      expect(p.locality_id).toBe("loc-chasapara")
    );
  });

  it("filters verified listings only", () => {
    const verified = dataStore.getPandals({ verifiedOnly: true });
    verified.forEach((p) => {
      expect(p.is_verified).toBe(true);
      expect(p.latitude).not.toBeNull();
      expect(p.longitude).not.toBeNull();
    });

    // Unverified entry should NOT be in verified listings
    const candidate = verified.find((p) => p.slug === "palpara-barowari");
    expect(candidate).toBeUndefined();
  });

  it("searches pandals by name in English and Bengali", () => {
    // English search
    const searchEng = dataStore.getPandals({ search: "Rajbari" });
    expect(searchEng.length).toBeGreaterThanOrEqual(1);
    expect(searchEng[0].slug).toContain("krishnanagar-rajbari");

    // Bengali search
    const searchBn = dataStore.getPandals({ search: "বুড়িমা" });
    expect(searchBn.length).toBeGreaterThanOrEqual(1);
    expect(searchBn[0].slug).toContain("chasapara");
  });

  it("creates, updates and deletes a new pandal", () => {
    const newPandal = dataStore.savePandal({
      name: "Test Barowari",
      name_bn: "টেস্ট বারোয়ারী",
      address: "Krishnanagar Station Road",
      category: "traditional",
      latitude: 23.4,
      longitude: 88.5,
      is_published: true,
      is_verified: true,
    });

    expect(newPandal.id).toBeDefined();
    expect(dataStore.getPandalBySlug(newPandal.slug)).toBeDefined();

    // Update
    dataStore.savePandal({
      ...newPandal,
      name: "Updated Test Barowari",
    });
    const updated = dataStore.getPandalById(newPandal.id);
    expect(updated?.name).toBe("Updated Test Barowari");

    // Delete
    dataStore.deletePandal(newPandal.id);
    expect(dataStore.getPandalById(newPandal.id)).toBeUndefined();
  });

  it("handles community submissions queue", () => {
    const initialCount = dataStore.getSubmissions().length;
    const sub = dataStore.addSubmission({
      submission_type: "timing_update",
      pandal_id: "pandal-krishnanagar-rajbari",
      pandal_name: "Krishnanagar Rajbari",
      submitted_data: {
        reporter_name: "Local Devotee",
        description: "Confirmed Dashami arati at 9:00 PM.",
      },
    });

    expect(dataStore.getSubmissions().length).toBe(initialCount + 1);
    expect(sub.status).toBe("pending");

    // Approve submission
    dataStore.updateSubmissionStatus(sub.id, "approved");
    const reviewed = dataStore.getSubmissions().find((s) => s.id === sub.id);
    expect(reviewed?.status).toBe("approved");
  });
});

