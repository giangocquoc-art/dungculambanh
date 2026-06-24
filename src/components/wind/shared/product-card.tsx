"use client";

import { useRouter } from "@/lib/router";
import { formatVND } from "@/lib/format";
import { useCart } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

/** Thẻ sản phẩm — dùng ảnh thật, badge thân thiện */
export function ProductCard({ product }: { product: Product }) {
  const { push } = useRouter();
  const add = useCart((s) => s.add);
  const { toast } = useToast();

  const priceText =
    product.priceMin === product.priceMax
      ? formatVND(product.priceMin)
      : `${formatVND(product.priceMin)} - ${formatVND(product.priceMax)}`;

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceMin: product.priceMin,
      priceMax: product.priceMax,
      category: product.category,
    });
    toast({ title: "Đã thêm vào giỏ hàng", description: product.name });
  };

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        push(`/products/${product.slug}`);
      }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Ảnh sản phẩm thật */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-primary/15 to-secondary text-4xl font-extrabold text-primary/50">
            {product.name.charAt(0)}
          </div>
        )}
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full btn-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
            Bán chạy
          </span>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 grid place-items-center bg-background/70">
            <span className="rounded-full bg-foreground px-4 py-1.5 text-xs font-bold text-background">
              Tạm hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Thông tin */}
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-primary/80">
          {product.category}
        </span>
        <h3 className="line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
          {product.name}
        </h3>
        <div className="mt-3 flex items-end justify-between gap-2">
          <span className="text-base font-extrabold text-primary">{priceText}</span>
        </div>
        <button
          onClick={onAdd}
          disabled={product.stock <= 0}
          className="mt-3 w-full rounded-xl border border-primary bg-primary/10 px-3 py-2 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Thêm vào giỏ
        </button>
      </div>
    </a>
  );
}
