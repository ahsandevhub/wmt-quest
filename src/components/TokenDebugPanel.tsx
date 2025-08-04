import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refreshAuthToken } from "../lib/refreshToken";

interface JWTPayload {
  exp: number;
}

const TokenDebugPanel = () => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  // Fetch token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);

    if (token) {
      const { exp } = jwtDecode<JWTPayload>(token);
      const expiry = new Date(exp * 1000);
      setExpiryTime(expiry);
    }
  }, []);

  // Update countdown every second
  useEffect(() => {
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(expiryTime.getTime() - now.getTime(), 0);
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const handleManualRefresh = async () => {
    console.log("Manually triggering token refresh...");
    await refreshAuthToken((path) => navigate(path, { replace: true }));
    alert("Refresh Attempted. Check console & LocalStorage.");
  };

  // Listen to token changes (manual trigger)
  const refreshData = () => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token);

    if (token) {
      const { exp } = jwtDecode<JWTPayload>(token);
      const expiry = new Date(exp * 1000);
      setExpiryTime(expiry);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        backgroundColor: "#000",
        color: "#0f0",
        padding: "12px 16px",
        fontFamily: "monospace",
        borderRadius: "8px",
        zIndex: 9999,
      }}
    >
      <div>
        <strong>Token Debug Panel</strong>
      </div>
      <div>
        Token: {accessToken ? `${accessToken.substring(0, 20)}...` : "None"}
      </div>
      <div>
        Expires at: {expiryTime ? expiryTime.toLocaleTimeString() : "N/A"}
      </div>
      <div>Countdown: {countdown}</div>
      <button
        onClick={handleManualRefresh}
        style={{
          marginTop: "10px",
          padding: "4px 8px",
          background: "#0f0",
          color: "#000",
          border: "none",
          cursor: "pointer",
        }}
      >
        Manual Refresh Token
      </button>
      <br />
      <button
        onClick={refreshData}
        style={{
          marginTop: "10px",
          padding: "4px 8px",
          background: "#0f0",
          color: "#000",
          border: "none",
          cursor: "pointer",
        }}
      >
        Refresh Data
      </button>
    </div>
  );
};

export default TokenDebugPanel;
