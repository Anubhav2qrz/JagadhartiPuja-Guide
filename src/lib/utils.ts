import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatTime(timeString?: string | null): string {
  if (!timeString) return "";
  try {
    const date = new Date(timeString);
    return new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return timeString;
  }
}

/**
 * Safely extracts human-readable opening hours text from a string, JSON string,
 * or nested object (e.g. Supabase JSONB or recursively nested { hours: ... }).
 */
export function formatOpeningHours(raw?: any): string | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("{") && trimmed.includes("hours")) {
      try {
        return formatOpeningHours(JSON.parse(trimmed));
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  }
  let curr = raw;
  let safetyLimit = 100;
  while (curr && typeof curr === "object" && safetyLimit-- > 0) {
    if (typeof curr.hours === "string") {
      return formatOpeningHours(curr.hours);
    }
    if (typeof curr.hours === "object" && curr.hours !== null) {
      curr = curr.hours;
      continue;
    }
    const values = Object.values(curr).filter((v) => typeof v === "string");
    if (values.length > 0) return values.join(", ");
    break;
  }
  return null;
}

/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Produces a lightweight JPEG data URL (~80-150KB) so localStorage
 * quota is never exceeded and network payloads remain fast.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

