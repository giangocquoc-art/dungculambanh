"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/router";
import { useAuth } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { formatVND, formatDateTime, ORDER_STATUS_LABEL } from "@/lib/format";
import type { Order } from "@/lib/types";
import { AdminLayout } from "./admin-layout";

const FILTERS = ["ALL", "PENDING", "APPROVED", "COMPLETED", "REJECTED"] as const;

export function AdminOrders() {
  const { push } = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [loadingList, setLoadingList] = useState(true);
  const [detail, setDetail] = useState<Order | null>(null);

  const load = (f: string) => {
    setLoadingList(true);
    fetch(`/api/admin/orders?status=${f}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoadingList(false));
  };

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
          const r = await fetch(`/api/admin/orders?status=${filter}`);
          const d = await r.json();
          if (active) setOrders(d.orders || []);
        } finally {
          if (active) setLoadingList(false);
        }
      })();
      return () => {
        active = false;
      };
    }
  }, [user, loading, push, filter]);

  const updateStatus = async (order: Order, status: Order["status"]) => {
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast({ title: "Lỗi", description: data.error, variant: "destructive" });
      return;
    }
    toast({ title: `Đơn ${order.code}: ${ORDER_STATUS_LABEL[status]}` });
    load(filter);
    if (detail?.id === order.id) setDetail({ ...order, status });
  };

  if (loading || !user) return <div className="grid min-h-screen place-items-center text-muted-foreground">Đang tải...</div>;
  if (user.role !== "ADMIN") return null;

  return (
    <AdminLayout active="/admin/orders">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Duyệt đơn đặt hàng</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quản lý và duyệt các đơn từ khách hàng</p>
      </div>

      {/* Bộ lọc trạng thái */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              load(f);
            }}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/70 hover:border-primary"
            }`}
          >
            {f === "ALL" ? "Tất cả" : ORDER_STATUS_LABEL[f]} {f !== "ALL" && `(${orders.length})`}
          </button>
        ))}
      </div>

      {loadingList ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          Không có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{o.code}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold status-${o.status}`}>
                      {ORDER_STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(o.createdAt)} · {o.user?.name || o.customerName} ({o.user?.email || ""})
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {o.customerPhone} · {o.customerAddress}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    {o.orderItems?.length || 0} sản phẩm · ship {formatVND(o.shipFee)}
                  </div>
                  <div className="text-lg font-extrabold text-primary">{formatVND(o.total)}</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <button
                  onClick={() => setDetail(o)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
                >
                  Chi tiết
                </button>
                {o.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => updateStatus(o, "APPROVED")}
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Duyệt đơn
                    </button>
                    <button
                      onClick={() => updateStatus(o, "REJECTED")}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Từ chối
                    </button>
                  </>
                )}
                {o.status === "APPROVED" && (
                  <button
                    onClick={() => updateStatus(o, "COMPLETED")}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Đánh dấu hoàn thành
                  </button>
                )}
                {o.status === "REJECTED" && (
                  <span className="text-xs text-muted-foreground">Đã hoàn trả tồn kho</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-background p-6 shadow-xl sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Đơn {detail.code}</h2>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold status-${detail.status}`}>
                  {ORDER_STATUS_LABEL[detail.status]}
                </span>
              </div>
              <button onClick={() => setDetail(null)} className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted">
                Đóng
              </button>
            </div>
            <dl className="space-y-2 text-sm">
              <Row label="Khách hàng" value={`${detail.user?.name || detail.customerName} (${detail.user?.email || ""})`} />
              <Row label="Số điện thoại" value={detail.customerPhone} />
              <Row label="Địa chỉ" value={detail.customerAddress} />
              <Row label="Thời gian" value={formatDateTime(detail.createdAt)} />
              {detail.note && <Row label="Ghi chú" value={detail.note} />}
            </dl>
            <h3 className="mt-5 text-sm font-bold">Sản phẩm</h3>
            <div className="mt-2 space-y-1.5">
              {detail.orderItems?.map((it, i) => (
                <div key={i} className="flex justify-between rounded-md border border-border px-3 py-2 text-sm">
                  <span className="min-w-0">
                    <span className="font-semibold">{it.quantity} × </span>
                    <span className="text-muted-foreground">{it.productName}</span>
                  </span>
                  <span className="font-semibold">{formatVND(it.unitPrice * it.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span>{formatVND(detail.total - detail.shipFee)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phí ship</span><span>{formatVND(detail.shipFee)}</span></div>
              <div className="flex justify-between text-base font-extrabold"><span>Tổng cộng</span><span className="text-primary">{formatVND(detail.total)}</span></div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
