"use client";

import { useRouter } from "@/lib/router";
import { useAuth } from "@/lib/store";
import { logout } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

const MENU = [
  { label: "Tổng quan", path: "/admin" },
  { label: "Thống kê doanh thu", path: "/admin/stats" },
  { label: "Sản phẩm", path: "/admin/products" },
  { label: "Đơn hàng", path: "/admin/orders" },
  { label: "Người dùng", path: "/admin/users" },
];

/** Layout sidebar cho trang quản trị. Yêu cầu đăng nhập với role ADMIN. */
export function AdminLayout({ children, active }: { children: React.ReactNode; active: string }) {
  const { push, route } = useRouter();
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  const isActive = (path: string) =>
    path === "/admin" ? route.path === "/admin" : route.path.startsWith(path);

  const onLogout = async () => {
    await logout();
    setUser(null);
    toast({ title: "Đã đăng xuất" });
    push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30 md:flex-row">
      {/* Sidebar */}
      <aside className="border-b border-border bg-foreground text-background md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4 md:block">
          <button
            onClick={() => push("/admin")}
            className="flex items-center gap-2.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-extrabold text-primary-foreground">
              W
            </span>
            <div className="leading-tight">
              <div className="text-sm font-extrabold">WIND ADMIN</div>
              <div className="text-[11px] text-background/60">Bảng điều khiển</div>
            </div>
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3 md:pb-6">
          {MENU.map((m) => (
            <button
              key={m.path}
              onClick={() => push(m.path)}
              className={`shrink-0 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors md:w-full ${
                isActive(m.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-background/75 hover:bg-background/10"
              }`}
            >
              {m.label}
            </button>
          ))}
        </nav>

        <div className="hidden border-t border-background/10 px-3 py-4 md:block">
          <div className="rounded-lg bg-background/5 p-3">
            <div className="text-xs text-background/60">Đăng nhập</div>
            <div className="truncate text-sm font-semibold">{user?.name}</div>
            <div className="truncate text-[11px] text-background/50">{user?.email}</div>
          </div>
          <button
            onClick={() => push("/")}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-background/60 hover:bg-background/10"
          >
            ← Về cửa hàng
          </button>
          <button
            onClick={onLogout}
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-background/60 hover:bg-background/10"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Nội dung */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Topbar mobile */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
          <span className="text-sm font-bold">{MENU.find((m) => isActive(m.path))?.label || "Admin"}</span>
          <div className="flex gap-2">
            <button
              onClick={() => push("/")}
              className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium"
            >
              Cửa hàng
            </button>
            <button
              onClick={onLogout}
              className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium"
            >
              Thoát
            </button>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8">{children}</main>

        <footer className="mt-auto border-t border-border bg-card px-4 py-4 text-center text-xs text-muted-foreground md:px-8">
          Wind Baking Tool — Bảng quản trị · Phân quyền: {user?.role === "ADMIN" ? "Quản trị viên" : "—"}
        </footer>
      </div>
    </div>
  );
}
