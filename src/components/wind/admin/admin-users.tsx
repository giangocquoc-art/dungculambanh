"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/router";
import { useAuth } from "@/lib/store";
import { formatDate } from "@/lib/format";
import type { AdminUser } from "@/lib/types";
import { AdminLayout } from "./admin-layout";

export function AdminUsers() {
  const { push } = useRouter();
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      push("/admin/login");
      return;
    }
    if (user?.role === "ADMIN") {
      let active = true;
      (async () => {
        setLoadingList(true);
        try {
          const r = await fetch("/api/admin/users");
          const d = await r.json();
          if (active) setUsers(d.users || []);
        } finally {
          if (active) setLoadingList(false);
        }
      })();
      return () => {
        active = false;
      };
    }
  }, [user, loading, push]);

  if (loading || !user) return <div className="grid min-h-screen place-items-center text-muted-foreground">Đang tải...</div>;
  if (user.role !== "ADMIN") return null;

  const userCount = users.filter((u) => u.role === "USER").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  return (
    <AdminLayout active="/admin/users">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Quản lý người dùng</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {userCount} khách hàng · {adminCount} quản trị viên
        </p>
      </div>

      {/* Thẻ phân quyền — làm rõ tách biệt ADMIN / USER */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/30 bg-primary/8 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-primary">Quản trị viên (ADMIN)</div>
          <div className="mt-1 text-2xl font-extrabold">{adminCount}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Có toàn quyền: xem thống kê, quản lý sản phẩm, duyệt đơn, xem người dùng.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Khách hàng (USER)</div>
          <div className="mt-1 text-2xl font-extrabold">{userCount}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Chỉ có thể đặt hàng, xem đơn của chính mình. Không thể truy cập trang quản trị.
          </p>
        </div>
      </div>

      {loadingList ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Người dùng</th>
                  <th className="px-4 py-3 text-left">Liên hệ</th>
                  <th className="px-4 py-3 text-left">Địa chỉ</th>
                  <th className="px-4 py-3 text-center">Vai trò</th>
                  <th className="px-4 py-3 text-center">Đơn hàng</th>
                  <th className="px-4 py-3 text-left">Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${u.role === "ADMIN" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"}`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{u.phone || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.address || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${u.role === "ADMIN" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"}`}>
                        {u.role === "ADMIN" ? "ADMIN" : "USER"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">{u.orderCount}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
