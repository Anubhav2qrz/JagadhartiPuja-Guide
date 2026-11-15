import { describe, it, expect, beforeEach, vi } from "vitest";

const STORAGE_KEY = "jd_visited_pandals_v1";

describe("Darshan Checklist & Visited Tracker Logic", () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: string) => {
        mockStorage[key] = val;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        mockStorage = {};
      },
    });
  });

  it("starts with empty visited set when localStorage is blank", () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    expect(parsed).toEqual([]);
    expect(parsed.length).toBe(0);
  });

  it("saves visited pandal IDs to localStorage", () => {
    const visited = ["pandal-1", "pandal-2"];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toContain("pandal-1");
    expect(stored).toContain("pandal-2");
    expect(stored.length).toBe(2);
  });

  it("handles toggling visited status correctly without duplicates", () => {
    let visited: string[] = [];

    const toggle = (id: string) => {
      if (visited.includes(id)) {
        visited = visited.filter((v) => v !== id);
      } else {
        visited = [...visited, id];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
    };

    // Check-in pandal 1
    toggle("chasapara-barowari-buri-maa");
    expect(visited).toContain("chasapara-barowari-buri-maa");
    expect(visited.length).toBe(1);

    // Check-in pandal 2
    toggle("baghadanga-barowari-bagha-maa");
    expect(visited).toHaveLength(2);

    // Toggle pandal 1 off (unmark)
    toggle("chasapara-barowari-buri-maa");
    expect(visited).not.toContain("chasapara-barowari-buri-maa");
    expect(visited).toContain("baghadanga-barowari-bagha-maa");
    expect(visited.length).toBe(1);
  });

  it("clears all visited pandals on reset", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(["p1", "p2", "p3", "p4", "p5"])
    );
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).length).toBe(5);

    localStorage.removeItem(STORAGE_KEY);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("calculates progress percentage and rank tier accurately", () => {
    const total = 40;
    const calculateStats = (count: number) => {
      const percentage = Math.min(100, Math.round((count / total) * 100));
      let rank = "Beginner";
      if (count >= 1 && count < 10) rank = "Devotee Explorer";
      else if (count >= 10 && count < 25) rank = "Avid Pandal Hopper";
      else if (count >= 25 && count < total) rank = "Krishnanagar Connoisseur";
      else if (count >= total) rank = "Maha Darshan Champion";
      return { percentage, rank };
    };

    expect(calculateStats(0).percentage).toBe(0);
    expect(calculateStats(0).rank).toBe("Beginner");

    expect(calculateStats(8).percentage).toBe(20);
    expect(calculateStats(8).rank).toBe("Devotee Explorer");

    expect(calculateStats(20).percentage).toBe(50);
    expect(calculateStats(20).rank).toBe("Avid Pandal Hopper");

    expect(calculateStats(35).percentage).toBe(88);
    expect(calculateStats(35).rank).toBe("Krishnanagar Connoisseur");

    expect(calculateStats(40).percentage).toBe(100);
    expect(calculateStats(40).rank).toBe("Maha Darshan Champion");
  });
});
