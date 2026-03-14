import { toast } from "react-toastify";

export const handleApiError = (err, setError = null) => {
  console.error("API Error Detail:", err);

  const response = err.response?.error;

  if (setError && response && typeof response === "object") {
    Object.keys(response).forEach((key) => {
      const message = Array.isArray(response[key])
        ? response[key][0]
        : response[key];

      setError(key, {
        type: "server",
        message: message,
      });
    });
  }

  const errorMessage =
    response?.detail ||
    response?.message ||
    (typeof response === "string" ? response : null) ||
    "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.";

  toast.error(errorMessage, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  return errorMessage;
};
