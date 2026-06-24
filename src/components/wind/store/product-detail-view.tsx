"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/router";
import { useCart } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { formatVND } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/wind/shared/product-card";

export function ProductDetailView({ slug }: { slug: string }) {
  const { push } = useRouter();
  const add = useCart((s) => s.add);
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) {
        if (active) {
          setProduct(null);
          setLoading(false);
        }
        return;
      }
      const data = await res.json();
      if (!active) return;
      setProduct(data.product);
      setLoading(false);
      // sản phẩm liên quan cùng danh mục
      const r = await fetch(`/api/products?category=${encodeURIComponent(data.product.category)}&limit=4`);
      const rd = await r.json();
      if (active) setRelated((rd.items || []).filter((p: Product) => p.id !== data.product.id).slice(0, 4));
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-8">
        <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
        <button
          onClick={() => push("/products")}
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Về trang sản phẩm
        </button>
      </div>
    );
  }

  const priceText =
    product.priceMin === product.priceMax
      ? formatVND(product.priceMin)
      : `${formatVND(product.priceMin)} - ${formatVND(product.priceMax)}`;

  const initials = product.name.replace(/[^\p{L}\s]/gu, "").trim().slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <nav className="mb-4 text-sm text-muted-foreground">
        <button onClick={() => push("/")} className="hover:text-primary">Trang chủ</button>
        <span className="mx-2">/</span>
        <button onClick={() => push("/products")} className="hover:text-primary">Sản phẩm</button>
        <span className="mx-2">/</span>
        <button
          onClick={() => push(`/products?category=${encodeURIComponent(product.category)}`)}
          className="hover:text-primary"
        >
          {product.category}
        </button>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Hình */}
        <div className="grid aspect-square place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-secondary to-primary/8">
          <span className="select-none text-9xl font-extrabold text-primary/60">
            {initials}
          </span>
        </div>

        {/* Thông tin */}
        <div className="flex flex-col">
          <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {product.category}
          </span>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
            {product.name}
          </h1>
          <div className="mt-4 text-3xl font-extrabold text-primary">{priceText}</div>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                product.stock > 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0 ? `Còn ${product.stock} trong kho` : "Hết hàng"}
            </span>
            {product.featured && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold uppercase text-primary-foreground">
                Sản phẩm hot
              </span>
            )}
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Mô tả</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Số lượng + thêm giỏ */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center text-lg font-bold hover:bg-muted"
              >
                −
              </button>
              <input
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="h-11 w-14 border-x border-border bg-transparent text-center text-sm font-semibold focus:outline-none"
              />
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-11 w-11 place-items-center text-lg font-bold hover:bg-muted"
              >
                +
              </button>
            </div>
            <button
              disabled={product.stock <= 0}
              onClick={() => {
                add(
                  {
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    priceMin: product.priceMin,
                    priceMax: product.priceMax,
                    category: product.category,
                  },
                  qty,
                );
                toast({ title: "Đã thêm vào giỏ hàng", description: `${qty} × ${product.name}` });
              }}
              className="flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={() => push("/cart")}
              className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              Xem giỏ hàng
            </button>
          </div>

          {/* Ghi chú chính sách */}
          <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
            <p>• Phí ship toàn quốc cố định {formatVND(30000)} / đơn.</p>
            <p>• Thanh toán khi nhận hàng (COD).</p>
            <p>• Đặt trực tiếp trên web để nhận giá ưu đãi.</p>
            <p>• Hotline tư vấn: 0941 806 169.</p>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight">Sản phẩm liên quan</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
