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
    let active = true;
    (async () => {
      const [fRes, cRes] = await Promise.all([
        fetch("/api/products?featured=true&limit=8"),
        fetch("/api/categories"),
      ]);
      const fData = await fRes.json();
      const cData = await cRes.json();
      if (active) {
        setFeatured(fData.items || []);
        setCategories(cData.categories || []);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* ===== HERO ấm áp, thân thiện ===== */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="dots-bg absolute inset-0 opacity-70" />
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:px-8 md:py-20">
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              WIND STORE — Bạn đồng hành của thợ bánh
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Làm bánh tại nhà,{" "}
              <span className="text-primary">đẹp như tiệm</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Mỗi chiếc khuôn, mỗi dụng cụ tại Wind đều được chọn để giúp bạn tự
              tin làm ra những mẻ bánh ngon cho gia đình và người thương. Đặt
              hàng online — nhận giá tốt, giao tận nhà.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => push("/products")}
                className="btn-gold rounded-xl px-7 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Khám phá sản phẩm
              </button>
              <button
                onClick={() => push("/about")}
                className="rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                Về Wind Store
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <div className="text-2xl font-extrabold text-primary">30.000đ</div>
                <div className="text-muted-foreground">Phí ship cố định toàn quốc</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-primary">COD</div>
                <div className="text-muted-foreground">Nhận hàng mới trả tiền</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-primary">0941 806 169</div>
                <div className="text-muted-foreground">Hotline tư vấn tận tình</div>
              </div>
            </div>
          </div>

          {/* Collage ảnh sản phẩm thật */}
          <div className="relative">
            <div className="relative mx-auto grid max-w-md grid-cols-2 gap-3">
              {featured.slice(0, 4).map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => push(`/products/${p.slug}`)}
                  className={`group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg ${
                    i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"
                  }`}
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-secondary text-2xl font-bold text-primary/50">
                      {p.name.charAt(0)}
                    </div>
                  )}
                </button>
              ))}
              {featured.length === 0 &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"} animate-pulse rounded-2xl bg-muted`}
                  />
                ))}
            </div>
            <div className="absolute -bottom-4 -right-2 rotate-3 rounded-2xl bg-foreground px-4 py-2 text-sm font-bold text-background shadow-lg">
              Giá tốt mỗi ngày ✦
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAM KẾT — 4 điểm thân thiện ===== */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-4 md:px-8">
          {[
            { t: "Đặt online dễ dàng", d: "Chọn — cho vào giỏ — đặt, chỉ 3 bước" },
            { t: "Giao toàn quốc 30k", d: "Phí ship cố định, không lo phát sinh" },
            { t: "Thanh toán khi nhận", d: "COD — xem hàng mới trả tiền" },
            { t: "Tư vấn tận tình", d: "Gọi 0941 806 169 khi cần hỗ trợ" },
          ].map((x) => (
            <div key={x.t} className="flex items-start gap-3 rounded-xl p-2">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full btn-gold text-sm font-bold text-primary-foreground">
                ✓
              </span>
              <div>
                <div className="text-sm font-bold text-foreground">{x.t}</div>
                <div className="text-xs text-muted-foreground">{x.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DANH MỤC ===== */}
      {categories.length > 0 && (
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                Mọi thứ cho bếp bánh của bạn
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Khám phá theo danh mục — đồ gì cũng có sẵn cho thợ bánh
              </p>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => push(`/products?category=${encodeURIComponent(c.name)}`)}
                  className="group rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
                >
                  <div className="text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                    {c.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.count} sản phẩm</div>
                  <div className="mt-3 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Xem ngay →
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SẢN PHẨM BÁN CHẠY ===== */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                Sản phẩm bán chạy
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Những món được các thợ bánh chọn nhiều nhất
              </p>
            </div>
            <button
              onClick={() => push("/products")}
              className="text-sm font-bold text-primary hover:underline"
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

      {/* ===== BANNER ƯU ĐÃI ===== */}
      <section className="border-y border-border">
        <div className="relative overflow-hidden">
          <div className="dots-bg absolute inset-0 opacity-50" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center md:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Đặt online — nhận ngay giá ưu đãi
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Đặt hàng trực tiếp trên website Wind Baking Tool để nhận mức giá tốt
              hơn so với mua tại cửa hàng. Phí ship cố định {formatVND(30000)} cho
              mọi đơn toàn quốc.
            </p>
            <button
              onClick={() => push("/products")}
              className="btn-gold rounded-xl px-7 py-3 text-sm font-bold text-primary-foreground"
            >
              Bắt đầu mua sắm
            </button>
          </div>
        </div>
      </section>

      {/* ===== LỜI NGỎ ấm áp ===== */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                Lời ngỏ
              </div>
              <h3 className="mt-2 text-xl font-bold">Được tạo nên từ tình yêu bánh</h3>
              <p className="mt-2 text-sm leading-relaxed text-background/70">
                Wind Store ra đời từ chính những thợ bánh — chúng mình hiểu một
                dụng cụ tốt giúp niềm vui nhân đôi. Nên mỗi món đều được chọn kỹ
                để bạn yên tâm dùng, làm bánh ngon mỗi ngày.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                Cho người mới bắt đầu
              </div>
              <h3 className="mt-2 text-xl font-bold">Không cần kinh nghiệm</h3>
              <p className="mt-2 text-sm leading-relaxed text-background/70">
                Bạn mới làm quen với bánh? Đừng lo — Wind có đầy đủ dụng cụ cơ bản,
                dễ dùng, kèm tư vấn tận tình. Từ thìa đong, khuôn silicone đến cân
                điện tử, đều sẵn sàng cho bạn.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-primary">
                Cho tiệm bánh nhỏ
              </div>
              <h3 className="mt-2 text-xl font-bold">Bền — đẹp — giá hợp lý</h3>
              <p className="mt-2 text-sm leading-relaxed text-background/70">
                Đang mở tiệm hoặc bán online? Wind cung cấp sỉ cho các mặt hàng
                khuôn, dụng cụ, bao bì. Gọi <span className="font-bold text-primary">0941 806 169</span> để
                được hỗ trợ chính sách bán sỉ.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
