"use client";

import { useState } from "react";
import { useRouter } from "@/lib/router";
import { useAuth } from "@/lib/store";
import { login } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

/** Trang đăng nhập riêng cho Admin — phong cách tối, khác biệt với cửa hàng. */
export function AdminLogin() {
  const { push } = useRouter();
  const setUser = useAuth((s) => s.setUser);
  const { toast } = useToast();
  const [email, setEmail] = useState("admin@windbakingtool.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== "ADMIN") {
        setError("Tài khoản này không có quyền quản trị.");
        setUser(null);
        return;
      }
      setUser(user);
      toast({ title: "Đăng nhập quản trị thành công", description: user.name });
      push("/admin");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-foreground px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary text-2xl font-extrabold text-primary-foreground">
            W
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-background">
            Wind Baking Tool
          </h1>
          <p className="mt-1 text-sm text-background/60">Đăng nhập trang quản trị</p>
        </div>

        <div className="rounded-2xl border border-background/10 bg-background p-6 shadow-xl">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email quản trị"
              required
              className="input"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              required
              className="input"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập quản trị"}
            </button>
          </form>

          <div className="mt-5 rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Tài khoản quản trị demo:</p>
            <p className="mt-1">Email: admin@windbakingtool.com</p>
            <p>Mật khẩu: admin123</p>
          </div>

          <button
            onClick={() => push("/")}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            ← Về trang cửa hàng
          </button>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--input));
          background: hsl(var(--background));
          padding: 0.65rem 0.8rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.25);
        }
      `}</style>
    </div>
  );
}
