// Utility functions for managing tokens in local storage
export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const removeAccessToken = () => {
  localStorage.removeItem("accessToken");
};

// Utility functions for managing refresh tokens in local storage
export const setRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const removeRefreshToken = () => {
  localStorage.removeItem("refreshToken");
};
