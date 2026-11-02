# Jagadhatri Darshan — Pandal Data Import & Verification Guide

This directory contains import templates for adding new pandals to **Jagadhatri Darshan**.

## Files
- `pandals-template.csv`: Standard spreadsheet format for bulk entry.
- `pandals-template.json`: Structured JSON schema for programmatic import.

## Mandatory Data Integrity Rules (Section 16)
Every candidate entry must be verified prior to marking `is_verified = true`:
1. **Name in English and Bengali**: Ensure culturally accurate transcription (e.g. "Chasapara Buri Maa" / "চাষাপাড়া বুড়িমা").
2. **Exact GPS Coordinates**:
   - Must be verified on-site or via official municipal geodata.
   - Longitude and Latitude must fall within Krishnanagar bounds (`Lat: 23.35 - 23.45`, `Lng: 88.45 - 88.55`).
   - If coordinates are unverified, leave `latitude` and `longitude` empty (`null`), and set `is_verified = false`.
   - Never invent or guess coordinates. Unverified records automatically have their Google Maps navigation buttons disabled to protect visitors.
3. **Darshan Timings**:
   - Only specify `darshan_start` and `darshan_end` if confirmed by the organizing committee.
   - Record `timings_verified_at` timestamp.
4. **Photographs**:
   - Must be properly licensed festival photography or committee-provided assets.
   - Fallback placeholders are provided if no authorized photograph is available.

## How to Import
1. Fill out `pandals-template.csv` or `pandals-template.json`.
2. In Supabase Dashboard: Navigate to **Table Editor** > **pandals** > **Insert** > **Import data from CSV**.
3. Alternatively, use the authenticated `/admin` portal to enter listings with the interactive map pin picker.

