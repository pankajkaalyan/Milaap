import { useEffect } from "react";

const useInactivityTimeout = (timeout = 10 * 60 * 1000) => {
  let timer: ReturnType<typeof setTimeout>;

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      alert("You were inactive for too long. Logging out...");
      localStorage.clear();
       window.location.href = "/login"; // ✅ direct redirect
    }, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => events.forEach(event => window.removeEventListener(event, resetTimer));
  }, []);
};

export default useInactivityTimeout;
