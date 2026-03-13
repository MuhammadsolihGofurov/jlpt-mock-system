const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

function getAuthHeader() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

// auth fetcher
function updateOptions(options, auth) {
  return {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
      ...(auth ? getAuthHeader() : {}), // Faqat auth kerak bo‘lsa qo‘shish
    },
  };
}

export default async function fetcher(
  url = "",
  options = {},
  params = {},
  auth = false,
) {
  if (!url) {
    console.error("Fetcher: URL manzil ko'rsatilmadi!");
    return null;
  }

  // console.error("BASE_URL:", process.env.NEXT_PUBLIC_BASE_API_URL);
  // console.error("URL:", url);

  try {
    const cleanUrl = url.replace(/^\/+/, "");
    const __url = new URL(cleanUrl, BASE_URL);

    Object.keys(params).forEach((key) =>
      __url.searchParams.append(key, params[key]),
    );

    const response = await fetch(__url, updateOptions(options, auth));

    if (!response.ok) {
      const errorData = await response.json();
      const enrichedError = new Error(
        errorData.message || "API request failed",
      );
      enrichedError.error = errorData.error;
      enrichedError.status = response.status;
      enrichedError.data = errorData;
      throw enrichedError;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
