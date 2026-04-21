import { authAxios } from "@/utils/axios";

const KNOWN_STORAGE_PREFIXES = [
  "tenants/",
  "jft_mock_tests/",
  "mock_tests/",
  "materials/",
  "owner-materials/",
  "avatars/",
  "center_avatars/",
  "group_avatars/",
];

function extractStorageKeyCandidate(rawValue) {
  if (typeof rawValue !== "string") return rawValue;

  let normalized = rawValue.trim();
  if (!normalized) return "";

  // Handle signed URLs and path-style S3 URLs.
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    try {
      const parsed = new URL(normalized);
      normalized = decodeURIComponent(parsed.pathname || "");

      // Some gateways expose the actual key in query params.
      const queryKey =
        parsed.searchParams.get("file_key") ||
        parsed.searchParams.get("key") ||
        parsed.searchParams.get("path");
      if (typeof queryKey === "string" && queryKey.trim()) {
        normalized = queryKey.trim();
      }
    } catch {
      // Fallback to raw string if URL parsing fails.
    }
  }

  normalized = normalized.replace(/^\/+/, "");
  if (normalized.startsWith("media/")) {
    normalized = normalized.slice("media/".length);
  }

  if (KNOWN_STORAGE_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return normalized;
  }

  const mediaMarkerIndex = normalized.indexOf("media/");
  if (mediaMarkerIndex !== -1) {
    const tail = normalized.slice(mediaMarkerIndex + "media/".length);
    if (KNOWN_STORAGE_PREFIXES.some((prefix) => tail.startsWith(prefix))) {
      return tail;
    }
  }

  for (const prefix of KNOWN_STORAGE_PREFIXES) {
    const idx = normalized.indexOf(prefix);
    if (idx !== -1) {
      return normalized.slice(idx);
    }
  }

  return normalized;
}

export function normalizeMediaReference(value) {
  if (typeof value !== "string") return value;
  const normalized = extractStorageKeyCandidate(value);
  return normalized === "" ? null : normalized;
}

/**
 * Faylni /media-uploads/ ga yuboradi va file_key qaytaradi.
 * @param {File} file - yuklash kerak bo'lgan fayl
 * @param {string} target - backend targetidan biri:
 *   "jlpt_question" | "jlpt_group" | "jlpt_question_audio" | "jlpt_group_audio"
 *   "jft_question"  | "jft_shared_content" | "jft_question_audio" | "jft_shared_content_audio"
 *   "quiz_question"
 * @returns {Promise<string>} file_key (masalan: "tenants/abc/jft_mock_tests/...")
 */
export async function uploadMedia(file, target) {
  const formData = new FormData();
  formData.append("target", target);
  formData.append("file", file);

  const res = await authAxios.post("media-uploads/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.file_key;
}