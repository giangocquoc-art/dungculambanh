"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/store";

/**
 * Hook load user hiện tại từ /api/auth/me một lần khi app mount.
 */
export function useAuthBootstrap() {
  const setUser = useAuth((s) => s.setUser);
  const setLoading = useAuth((s) => s.setLoading);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (active) setUser(data.user || null);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [setUser, setLoading]);
}

/** Đăng nhập */
export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại.");
  return data.user;
}

/** Đăng ký */
export async function register(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Đăng ký thất bại.");
  return data.user;
}

/** Đăng xuất */
export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}
