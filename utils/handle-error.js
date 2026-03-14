import { toast } from "react-toastify";

export const handleApiError = (err, setError = null) => {
  console.error("API Error Detail:", err);

  const errorData = err.response?.data?.error;
  const generalMessage = err.response?.data?.message;

  if (setError && errorData && typeof errorData === "object") {
    Object.keys(errorData).forEach((key) => {
      const message = Array.isArray(errorData[key])
        ? errorData[key][0]
        : errorData[key];

      setError(key, {
        type: "server",
        message: message,
      });
    });
  }

  let errorMessage = "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.";

  if (typeof errorData === "string") {
    errorMessage = errorData;
  } else if (errorData && typeof errorData === "object") {
    const firstKey = Object.keys(errorData)[0];
    errorMessage = Array.isArray(errorData[firstKey])
      ? errorData[firstKey][0]
      : errorData[firstKey];
  } else if (generalMessage) {
    errorMessage = generalMessage;
  }
  toast.error(errorMessage, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  return errorMessage;
};
