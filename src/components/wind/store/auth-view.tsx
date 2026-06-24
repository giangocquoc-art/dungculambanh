"use client";

import { useState } from "react";
import { useRouter } from "@/lib/router";
import { useAuth } from "@/lib/store";
import { login, register } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

export function AuthView({ mode, redirect }: { mode: "login" | "register"; redirect?: string }) {
  const { push } = useRouter();
  const setUser = useAuth((s) => s.setUser);
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user =
        mode === "login"
          ? await login(email, password)
          : await register({ name, email, password, phone, address });
      setUser(user);
      toast({
        title: mode === "login" ? "Đăng nhập thành công" : "Đăng ký thành công",
        description: `Xin chào, ${user.name}!`,
      });
      // Nếu là admin -> vào trang quản trị, ngược lại về redirect hoặc trang chủ
      if (user.role === "ADMIN" && (!redirect || redirect === "/")) {
        push("/admin");
      } else {
        push(redirect || "/");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 md:px-8">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-primary text-lg font-extrabold text-primary-foreground">
            W
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
            {mode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Đăng nhập để đặt hàng và xem đơn của bạn"
              : "Tạo tài khoản để đặt hàng nhanh hơn"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "register" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ và tên"
              required
              className="input"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu (ít nhất 6 ký tự)"
            required
            minLength={6}
            className="input"
          />
          {mode === "register" && (
            <>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại"
                className="input"
              />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ nhận hàng"
                className="input"
              />
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Chưa có tài khoản?{" "}
              <button
                onClick={() => push("/register")}
                className="font-semibold text-primary hover:underline"
              >
                Đăng ký
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <button
                onClick={() => push("/login")}
                className="font-semibold text-primary hover:underline"
              >
                Đăng nhập
              </button>
            </>
          )}
        </div>

        {mode === "login" && (
          <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Tài khoản demo:</p>
            <p className="mt-1">Admin: admin@windbakingtool.com / admin123</p>
            <p>User: mai.nguyen@example.com / user123</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--input));
          background: hsl(var(--background));
          padding: 0.6rem 0.75rem;
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
