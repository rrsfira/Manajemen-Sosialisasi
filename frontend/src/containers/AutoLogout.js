import { useEffect } from "react";

const AutoLogout = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");

    if (token && expiresAt) {
      const remaining = parseInt(expiresAt) - Date.now();

      if (remaining <= 0) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        const timeout = setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, remaining);

        return () => clearTimeout(timeout);
      }
    }
  }, []);

  return null;
};

export default AutoLogout;
