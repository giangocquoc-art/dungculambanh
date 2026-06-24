"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/router";
import { useAuth } from "@/lib/store";
import { formatVND, ORDER_STATUS_LABEL } from "@/lib/format";
import type { Stats } from "@/lib/types";
import { AdminLayout } from "./admin-layout";

export function AdminDashboard() {
  const { push } = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      push("/admin/login");
      return;
    }
    if (!loading && user && user.role !== "ADMIN") {
      push("/");
      return;
    }
    if (user?.role === "ADMIN") {
      let active = true;
      (async () => {
        const r = await fetch("/api/admin/stats");
        const d = await r.json();
        if (active) setStats(d);
      })();
      return () => {
        active = false;
      };
    }
  }, [user, loading, push]);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Đang tải...</div>;
  }
  if (user.role !== "ADMIN") return null;

  return (
    <AdminLayout active="/admin">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Tổng quan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chào mừng <span className="font-semibold text-foreground">{user.name}</span> — tổng hợp
          hoạt động cửa hàng.
        </p>
      </div>

      {!stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <>
          {/* 4 thẻ KPI */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              title="Tổng doanh thu"
              value={formatVND(stats.totalRevenue)}
              sub="Đơn đã duyệt + hoàn thành"
              highlight
            />
            <Kpi title="Tổng đơn hàng" value={String(stats.totalOrders)} sub="Tất cả trạng thái" />
            <Kpi title="Sản phẩm" value={String(stats.totalProducts)} sub="Đang bán" />
            <Kpi title="Khách hàng" value={String(stats.totalUsers)} sub="Tài khoản USER" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Biểu đồ doanh thu 7 ngày */}
            <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-base font-bold">Doanh thu 7 ngày gần nhất</h2>
                  <p className="text-xs text-muted-foreground">Đơn vị VNĐ</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Giá trị TB / đơn</div>
                  <div className="text-sm font-bold text-primary">{formatVND(stats.avgOrderValue)}</div>
                </div>
              </div>
              <BarChart data={stats.last7Days} />
            </div>

            {/* Trạng thái đơn */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-bold">Trạng thái đơn hàng</h2>
              <div className="mt-4 space-y-3">
                {(["PENDING", "APPROVED", "COMPLETED", "REJECTED"] as const).map((s) => {
                  const count = stats.byStatus[s] || 0;
                  const pct = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;
                  return (
                    <div key={s}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{ORDER_STATUS_LABEL[s]}</span>
                        <span className="font-bold">{count}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full status-bar-${s}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top danh mục */}
          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-bold">Doanh thu theo danh mục (Top 5)</h2>
            {stats.byCategory.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Chưa có dữ liệu.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {stats.byCategory.map((c) => {
                  const max = stats.byCategory[0].revenue || 1;
                  const pct = (c.revenue / max) * 100;
                  return (
                    <div key={c.category}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{c.category}</span>
                        <span className="font-bold text-primary">{formatVND(c.revenue)}</span>
                      </div>
                      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <style jsx global>{`
        .status-bar-PENDING { background: hsl(38 92% 52%); }
        .status-bar-APPROVED { background: hsl(150 60% 40%); }
        .status-bar-COMPLETED { background: hsl(200 60% 45%); }
        .status-bar-REJECTED { background: hsl(0 72% 48%); }
      `}</style>
    </AdminLayout>
  );
}

function Kpi({
  title,
  value,
  sub,
  highlight,
}: {
  title: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
      }`}
    >
      <div className={`text-xs font-semibold uppercase tracking-wide ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {title}
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{value}</div>
      <div className={`mt-1 text-xs ${highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        {sub}
      </div>
    </div>
  );
}

/** Biểu đồ cột CSS thuần — không dùng thư viện chart */
function BarChart({ data }: { data: { label: string; revenue: number; orders: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="mt-5">
      <div className="flex h-48 items-end justify-between gap-2">
        {data.map((d, i) => {
          const h = (d.revenue / max) * 100;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/60 to-primary transition-all hover:from-primary hover:to-primary"
                  style={{ height: `${Math.max(h, 2)}%` }}
                  title={`${formatVND(d.revenue)} · ${d.orders} đơn`}
                />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">{d.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap justify-end gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        {data.map((d, i) => (
          <span key={i}>
            {d.label}: <span className="font-bold text-foreground">{formatVND(d.revenue)}</span> ({d.orders})
          </span>
        ))}
      </div>
    </div>
  );
}
