"use client";

import { useRouter } from "@/lib/router";
import { formatVND } from "@/lib/format";
import { useCart } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

/** Thẻ sản phẩm — không dùng icon, dùng chữ cái đầu + danh mục làm hình đại diện */
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

  // Lấy 2 chữ cái đầu tiên làm chữ đại diện
  const initials = product.name.replace(/[^\p{L}\s]/gu, "").trim().slice(0, 2).toUpperCase();

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        push(`/products/${product.slug}`);
      }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
    >
      {/* Khung hình đại diện — CSS gradient + chữ */}
      <div className="relative grid aspect-square place-items-center overflow-hidden bg-gradient-to-br from-primary/15 via-secondary to-primary/8">
        <span className="select-none text-5xl font-extrabold text-primary/70 transition-transform group-hover:scale-110">
          {initials}
        </span>
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
            Hot
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-md bg-background/80 px-2 py-1 text-[11px] font-semibold text-foreground/80 backdrop-blur">
          {product.category}
        </span>
      </div>

      {/* Thông tin */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="mt-3 flex items-end justify-between gap-2">
          <span className="text-base font-bold text-primary">{priceText}</span>
        </div>
        <button
          onClick={onAdd}
          className="mt-3 w-full rounded-lg border border-primary bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Thêm vào giỏ
        </button>
      </div>
    </a>
  );
}
