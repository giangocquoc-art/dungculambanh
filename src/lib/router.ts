"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Hash router — tất cả view đều nằm trên route "/" duy nhất.
 * Ví dụ hash: #/ , #/products, #/products/<slug>, #/cart, #/admin, #/admin/products ...
 */
export interface Route {
  path: string; // e.g. "/products/khuon-silicone"
  segments: string[]; // ["products", "khuon-silicone"]
}

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const segments = path.split("/").filter(Boolean);
  return { path, segments };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() =>
    typeof window !== "undefined" ? parseHash() : { path: "/", segments: [] },
  );

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onHash);
    // Khởi tạo hash nếu trống
    if (!window.location.hash) {
      window.location.hash = "/";
    }
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const push = useCallback((path: string) => {
    const target = path.startsWith("/") ? path : `/${path}`;
    if (window.location.hash === `#${target}`) {
      // cùng hash, vẫn cuộn lên đầu
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.hash = target;
    }
  }, []);

  return { route, push };
}

/** Link dạng hash — click sẽ đổi hash mà không reload */
export function hashHref(path: string): { href: `#${string}` } {
  const target = path.startsWith("/") ? path : `/${path}`;
  return { href: `#${target}` };
}
