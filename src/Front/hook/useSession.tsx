import { useState, useEffect } from "react";

const SESSION_KEY = "user_session";
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutos

export function useSession<T>(initialValue: T | null = null) {
  const [session, setSessionState] = useState<T | null>(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_KEY);
      if (!storedSession) return initialValue;

      const { value, timestamp } = JSON.parse(storedSession);
      if (Date.now() - timestamp > EXPIRATION_TIME) {
        localStorage.removeItem(SESSION_KEY);
        return initialValue;
      }
      return value;
    } catch (error) {
      console.error("Error al cargar la sesión:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ value: session, timestamp: Date.now() }));
    }
  }, [session]);

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setSessionState(null);
  };

  return { session, setSession: setSessionState, clearSession };
}
