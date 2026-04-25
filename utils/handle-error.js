import { toast } from "react-toastify";

const FALLBACK_MESSAGE = "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.";

const flattenToString = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      const out = flattenToString(item);
      if (out) return out;
    }
    return "";
  }
  if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      const out = flattenToString(value[key]);
      if (out) return out;
    }
    return "";
  }
  return String(value);
};

// Extract a human-readable message from a DRF/axios error response.
// Handles common shapes:
//   { error: "..." | { field: [...] } }
//   { message: "..." }
//   { detail: "..." }
//   { non_field_errors: [...] }
//   { <field>: [".."] | "..." }   <- DRF ValidationError
const extractApiMessage = (err) => {
  const data = err?.response?.data;
  if (!data) return "";

  if (typeof data === "string") return data;

  const orderedKeys = ["error", "message", "detail", "non_field_errors"];
  for (const key of orderedKeys) {
    if (data[key] != null) {
      const msg = flattenToString(data[key]);
      if (msg) return msg;
    }
  }

  for (const key of Object.keys(data)) {
    if (orderedKeys.includes(key)) continue;
    const msg = flattenToString(data[key]);
    if (msg) return msg;
  }

  return "";
};

export const handleApiError = (err, setError = null) => {
  console.error("API Error Detail:", err);

  const errorData = err?.response?.data?.error;

  if (setError && errorData && typeof errorData === "object" && !Array.isArray(errorData)) {
    Object.keys(errorData).forEach((key) => {
      const message = Array.isArray(errorData[key])
        ? errorData[key][0]
        : errorData[key];
      setError(key, { type: "server", message });
    });
  }

  const errorMessage = extractApiMessage(err) || FALLBACK_MESSAGE;

  toast.error(errorMessage, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  return errorMessage;
};
