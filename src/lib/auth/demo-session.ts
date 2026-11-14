"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEMO_ADMIN, DEMO_STUDENTS, findDemoUser, type DemoUser } from "./demo-users";

export const DEMO_AUTH_STORAGE_KEY = "sekuriva.auth.active_user_id";
export const DEMO_AUTH_EVENT = "sekuriva:auth-changed";

export function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getCurrentUser(fallbackRole: "admin" | "siswa" = "siswa"): DemoUser {
  const storedId = getStoredUserId();
  if (storedId) {
    const found = findDemoUser(storedId);
    if (found) return found;
  }
  return fallbackRole === "admin" ? DEMO_ADMIN : DEMO_STUDENTS[0];
}

export function setCurrentUser(user: DemoUser): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DEMO_AUTH_STORAGE_KEY, user.id);
    document.cookie = `sekuriva_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `sekuriva_user_id=${user.id}; path=/; max-age=86400; SameSite=Lax`;
  } catch {
    // storage fallback
  }
  window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
}

export function clearCurrentUser(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    document.cookie = "sekuriva_role=; path=/; max-age=0";
    document.cookie = "sekuriva_user_id=; path=/; max-age=0";
  } catch {
    // storage fallback
  }
  window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
}

export function useCurrentUser(fallbackRole: "admin" | "siswa" = "siswa") {
  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === DEMO_AUTH_STORAGE_KEY) {
        callback();
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(DEMO_AUTH_EVENT, callback);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(DEMO_AUTH_EVENT, callback);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    return getCurrentUser(fallbackRole);
  }, [fallbackRole]);

  const getServerSnapshot = useCallback(() => {
    return fallbackRole === "admin" ? DEMO_ADMIN : DEMO_STUDENTS[0];
  }, [fallbackRole]);

  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { user, setCurrentUser, clearCurrentUser };
}
