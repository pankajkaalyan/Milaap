import { useEffect } from "react";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const useSessionTimeout = () => {

  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime && Date.now() - Number(loginTime) > SESSION_TIMEOUT) {
        // alert("Session expired! Please log in again.");
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login"; // ✅ direct redirect
        window.location.reload();
      }
    };

    const interval = setInterval(checkSession, 60000); // check every 1 min
    return () => clearInterval(interval);
  }, []);
};

export default useSessionTimeout;
