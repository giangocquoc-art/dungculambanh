"use client";

import { useState } from "react";
import { Logo } from "./logo";
import { hashHref, useRouter } from "@/lib/router";
import { useCart } from "@/lib/store";
import { useAuth } from "@/lib/store";
import { logout } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

const NAV = [
  { label: "Trang chủ", path: "/" },
  { label: "Sản phẩm", path: "/products" },
  { label: "Giới thiệu", path: "/about" },
  { label: "Liên hệ", path: "/contact" },
];

/** Header cửa hàng — cố định trên cùng, nền trắng mờ, việt dưới */
export function StoreHeader() {
  const { push, route } = useRouter();
  const cartCount = useCart((s) => s.count());
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? route.path === "/" : route.path.startsWith(path);

  const onLogout = async () => {
    await logout();
    setUser(null);
    toast({ title: "Đã đăng xuất" });
    push("/");
  };

  const go = (path: string) => {
    push(path);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Logo />

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <a
              key={item.path}
              {...hashHref(item.path)}
              onClick={(e) => {
                e.preventDefault();
                go(item.path);
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-primary/12 text-primary"
                  : "text-foreground/75 hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Giỏ hàng */}
          <button
            onClick={() => go("/cart")}
            className="relative rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Giỏ hàng
            {cartCount > 0 && (
              <span className="ml-1.5 inline-grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>

          {/* Tài khoản */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => go("/account")}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 hover:text-foreground"
              >
                {user.name}
              </button>
              {user.role === "ADMIN" && (
                <button
                  onClick={() => go("/admin")}
                  className="rounded-lg border border-primary bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
                >
                  Quản trị
                </button>
              )}
              <button
                onClick={onLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/60 hover:text-foreground"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => go("/login")}
              className="hidden sm:inline-flex rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-foreground/90"
            >
              Đăng nhập
            </button>
          )}

          {/* Menu mobile */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden rounded-lg border border-border px-3 py-2 text-sm font-semibold"
            aria-label="Mở menu"
          >
            {menuOpen ? "Đóng" : "Menu"}
          </button>
        </div>
      </div>

      {/* Menu mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) => (
              <a
                key={item.path}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  go(item.path);
                }}
                className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive(item.path) ? "bg-primary/12 text-primary" : "text-foreground/80 hover:bg-muted"
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="my-2 h-px bg-border" />
            {user ? (
              <>
                <button onClick={() => go("/account")} className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground/80 hover:bg-muted">
                  Tài khoản: {user.name}
                </button>
                {user.role === "ADMIN" && (
                  <button onClick={() => go("/admin")} className="rounded-md px-3 py-2.5 text-left text-sm font-semibold text-primary hover:bg-primary/10">
                    Trang quản trị
                  </button>
                )}
                <button onClick={onLogout} className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground/60 hover:bg-muted">
                  Đăng xuất
                </button>
              </>
            ) : (
              <button onClick={() => go("/login")} className="rounded-md bg-foreground px-3 py-2.5 text-left text-sm font-semibold text-background">
                Đăng nhập / Đăng ký
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
