import api from "./api/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE;

export async function refreshAuthToken(
  navigateTo: (path: string) => void
): Promise<string | undefined> {
  const storedRefreshToken = localStorage.getItem("refreshToken");

  if (!storedRefreshToken) {
    navigateTo("/");
    return;
  }

  try {
    const response = await api.post(
      `${API_BASE_URL}/api/v1/auth/refresh-token`,
      {
        refreshToken: storedRefreshToken,
      }
    );

    const newAccessToken = response?.data?.data?.accessToken;
    const newRefreshToken = response?.data?.data?.refreshToken;

    if (!newAccessToken || !newRefreshToken) {
      console.error("Token refresh API returned invalid data", response.data);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigateTo("/");
      return;
    }

    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh request failed", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigateTo("/");
  }
}
