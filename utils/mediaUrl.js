const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

function getApiOrigin() {
  if (!BASE_API_URL) return "";
  try {
    // Example BASE_API_URL: https://api.mikan.uz/api/v1/
    return new URL(BASE_API_URL).origin;
  } catch {
    // Fallback: best-effort strip known suffix.
    return String(BASE_API_URL).replace(/\/api\/v\d+\/?$/i, "").replace(/\/+$/g, "");
  }
}

/**
 * Convert backend media reference to a browser-loadable URL.
 *
 * Backend sometimes returns:
 * - a signed absolute URL (keep as-is)
 * - "/media/<key>"
 * - "<key>" like "tenants/.../file.jpg" (stored under MEDIA root)
 */
export function toMediaUrl(value) {
  if (!value || typeof value !== "string") return null;

  const raw = value.trim();
  if (!raw) return null;

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  const origin = getApiOrigin();
  if (!origin) return raw; // last resort: don't break existing behavior

  const normalized = raw.replace(/^\/+/, "");
  if (normalized.startsWith("media/")) return `${origin}/${normalized}`;
  if (normalized.startsWith("media")) return `${origin}/${normalized}`;

  // Most common: key without "media/" prefix.
  return `${origin}/media/${normalized}`;
}

