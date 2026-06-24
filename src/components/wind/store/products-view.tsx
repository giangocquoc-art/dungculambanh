"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/router";
import { ProductCard } from "@/components/wind/shared/product-card";
import type { Product } from "@/lib/types";

export function ProductsView() {
  const { route, push } = useRouter();

  // Phân tích query từ hash (dạng #/products?category=X&q=Y)
  const queryPart = route.path.includes("?") ? route.path.split("?")[1] : "";
  const params = new URLSearchParams(queryPart);
  // Trích xuất trực tiếp (derived state) — không lưu vào state để tránh sync trong effect
  const category = params.get("category") || "ALL";
  const q = params.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qInput, setQInput] = useState(q);

  // Đồng bộ ô tìm kiếm khi q trên URL đổi
  useEffect(() => {
    setQInput(q);
  }, [q]);

  // Fetch khi category / q đổi
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const sp = new URLSearchParams();
      if (category && category !== "ALL") sp.set("category", category);
      if (q) sp.set("q", q);
      const r = await fetch(`/api/products?${sp.toString()}`);
      const d = await r.json();
      if (active) {
        setProducts(d.items || []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [category, q]);

  const [cats, setCats] = useState<string[]>(["ALL"]);
  useEffect(() => {
    let active = true;
    (async () => {
      const r = await fetch("/api/categories");
      const d = await r.json();
      if (active && d.categories) {
        setCats(["ALL", ...d.categories.map((c: { name: string }) => c.name)]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateQuery = (next: { category?: string; q?: string }) => {
    const sp = new URLSearchParams();
    const c = next.category ?? category;
    const query = next.q ?? q;
    if (c && c !== "ALL") sp.set("category", c);
    if (query) sp.set("q", query);
    const qs = sp.toString();
    push(`/products${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Sản phẩm</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tổng hợp {products.length} sản phẩm — chọn danh mục để lọc
        </p>
      </div>

      {/* Thanh lọc */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => updateQuery({ category: c })}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/70 hover:border-primary hover:text-primary"
              }`}
            >
              {c === "ALL" ? "Tất cả" : c}
            </button>
          ))}
        </div>
        <input
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateQuery({ q: qInput });
          }}
          placeholder="Tìm sản phẩm..."
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-64"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
