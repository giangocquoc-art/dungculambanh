"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/router";
import { useAuth } from "@/lib/store";
import { logout } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { formatVND, formatDateTime, ORDER_STATUS_LABEL } from "@/lib/format";
import type { Order } from "@/lib/types";

export function AccountView() {
  const { push } = useRouter();
  const { user, setUser, loading } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      push("/login?redirect=/account");
    }
  }, [loading, user, push]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setOrdersLoading(true);
      try {
        const r = await fetch("/api/orders");
        const d = await r.json();
        if (active) setOrders(d.orders || []);
      } finally {
        if (active) setOrdersLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground">Đang tải...</div>;
  }
  if (!user) return null;

  const onLogout = async () => {
    await logout();
    setUser(null);
    toast({ title: "Đã đăng xuất" });
    push("/");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      {/* Thông tin tài khoản */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-extrabold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.role === "ADMIN" && (
                <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  Quản trị viên
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {user.role === "ADMIN" && (
              <button
                onClick={() => push("/admin")}
                className="rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
              >
                Vào trang quản trị
              </button>
            )}
            <button
              onClick={onLogout}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-muted"
            >
              Đăng xuất
            </button>
          </div>
        </div>
        {(user.phone || user.address) && (
          <div className="mt-5 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
            {user.phone && (
              <div>
                <span className="text-muted-foreground">Số điện thoại: </span>
                <span className="font-semibold">{user.phone}</span>
              </div>
            )}
            {user.address && (
              <div>
                <span className="text-muted-foreground">Địa chỉ: </span>
                <span className="font-semibold">{user.address}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Đơn hàng của tôi */}
      <div className="mt-8">
        <h2 className="text-lg font-extrabold tracking-tight">Đơn hàng của tôi</h2>
        {ordersLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
            Bạn chưa có đơn hàng nào.{" "}
            <button onClick={() => push("/products")} className="font-semibold text-primary hover:underline">
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-foreground">{o.code}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateTime(o.createdAt)}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold status-${o.status}`}
                  >
                    {ORDER_STATUS_LABEL[o.status] || o.status}
                  </span>
                </div>
                <div className="mt-3 border-t border-border pt-3 text-sm">
                  {o.orderItems?.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-0.5 text-muted-foreground">
                      <span className="line-clamp-1">
                        {it.quantity} × {it.productName}
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatVND(it.unitPrice * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">
                    Ship: {formatVND(o.shipFee)} · {o.customerPhone}
                  </span>
                  <span className="font-extrabold text-primary">{formatVND(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
