"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/router";
import { ProductCard } from "@/components/wind/shared/product-card";
import { formatVND } from "@/lib/format";
import type { Product, Category } from "@/lib/types";

export function HomeView() {
  const { push } = useRouter();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      const [fRes, cRes] = await Promise.all([
        fetch("/api/products?featured=true&limit=8"),
        fetch("/api/categories"),
      ]);
      const fData = await fRes.json();
      const cData = await cRes.json();
      setFeatured(fData.items || []);
      setCategories(cData.categories || []);
    })();
  }, []);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-yellow absolute inset-0 opacity-60" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              WIND STORE — Chuyên dụng cụ làm bánh
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Cửa hàng dụng cụ làm bánh{" "}
              <span className="text-primary">Wind Baking Tool</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Wind Store chuyên cung cấp các loại khuôn khay nướng bánh, dụng cụ làm bánh, dụng cụ
              hỗ trợ trang trí bánh, bao bì — túi hộp ngành bánh. Khách hàng có thể đặt trực tiếp
              trên web để nhận giá ưu đãi.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => push("/products")}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
              >
                Xem sản phẩm
              </button>
              <button
                onClick={() => push("/about")}
                className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                Giới thiệu
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <div className="text-2xl font-extrabold text-primary">30.000đ</div>
                <div className="text-muted-foreground">Phí ship toàn quốc / đơn</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-primary">COD</div>
                <div className="text-muted-foreground">Thanh toán khi nhận hàng</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-primary">0941 806 169</div>
                <div className="text-muted-foreground">Hotline hỗ trợ</div>
              </div>
            </div>
          </div>

          {/* Khối hình ảnh hero bằng CSS */}
          <div className="relative">
            <div className="relative mx-auto grid aspect-square max-w-md grid-cols-2 gap-3">
              <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5">
                <span className="text-7xl font-extrabold text-primary/60">WB</span>
              </div>
              <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-secondary to-primary/10">
                <span className="text-5xl font-extrabold text-foreground/40">KHUÔN</span>
              </div>
              <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary">
                <span className="text-5xl font-extrabold text-foreground/40">BAO BÌ</span>
              </div>
              <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5">
                <span className="text-5xl font-extrabold text-primary/60">TRANG TRÍ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DANH MỤC ===== */}
      {categories.length > 0 && (
        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Danh mục sản phẩm</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tất cả dụng cụ làm bánh bạn cần
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => push(`/products?category=${encodeURIComponent(c.name)}`)}
                  className="group rounded-xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <div className="text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                    {c.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.count} sản phẩm</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SẢN PHẨM HOT ===== */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Sản phẩm hot khuyến mãi</h2>
              <p className="mt-1 text-sm text-muted-foreground">Các mặt hàng bán chạy nhất</p>
            </div>
            <button
              onClick={() => push("/products")}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Xem tất cả →
            </button>
          </div>
          {featured.length === 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== GIỚI THIỆU NGẮN ===== */}
      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                Về chúng tôi
              </div>
              <h3 className="mt-2 text-xl font-bold">Wind Store</h3>
              <p className="mt-2 text-sm leading-relaxed text-background/70">
                Cửa hàng chuyên cung cấp dụng cụ làm bánh, dụng cụ làm bếp — từ khuôn nướng, khuôn
                silicone, dụng cụ trang trí đến bao bì ngành bánh.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                Đặt hàng
              </div>
              <h3 className="mt-2 text-xl font-bold">Đặt trực tiếp trên web</h3>
              <p className="mt-2 text-sm leading-relaxed text-background/70">
                Đặt hàng trực tiếp để nhận giá ưu đãi. Phí ship toàn quốc cố định{" "}
                <span className="font-bold text-primary">{formatVND(30000)}</span> / đơn. Thanh toán
                khi nhận hàng.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                Liên hệ
              </div>
              <h3 className="mt-2 text-xl font-bold">Hotline</h3>
              <p className="mt-2 text-sm leading-relaxed text-background/70">
                Gọi ngay <span className="font-bold text-primary">0941 806 169</span> để được tư vấn
                các loại khuôn khay, dụng cụ phù hợp với nhu cầu làm bánh của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
