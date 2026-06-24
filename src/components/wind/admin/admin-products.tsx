"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/router";
import { useAuth } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { formatVND, CATEGORIES } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AdminLayout } from "./admin-layout";

export function AdminProducts() {
  const { push } = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoadingList(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.items || []))
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
          const r = await fetch("/api/admin/products");
          const d = await r.json();
          if (active) setProducts(d.items || []);
        } finally {
          if (active) setLoadingList(false);
        }
      })();
      return () => {
        active = false;
      };
    }
  }, [user, loading, push]);

  const onDelete = async (p: Product) => {
    if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast({ title: "Không thể xóa", description: data.error, variant: "destructive" });
      return;
    }
    toast({ title: "Đã xóa sản phẩm" });
    load();
  };

  if (loading || !user) return <div className="grid min-h-screen place-items-center text-muted-foreground">Đang tải...</div>;
  if (user.role !== "ADMIN") return null;

  return (
    <AdminLayout active="/admin/products">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Quản lý sản phẩm</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} sản phẩm</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {loadingList ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Sản phẩm</th>
                  <th className="px-4 py-3 text-left">Danh mục</th>
                  <th className="px-4 py-3 text-right">Giá</th>
                  <th className="px-4 py-3 text-center">Tồn kho</th>
                  <th className="px-4 py-3 text-center">Hot</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-10 w-10 shrink-0 rounded-md object-cover ring-1 ring-border"
                          />
                        ) : (
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/15 text-xs font-bold text-primary">
                            {p.name.replace(/[^\p{L}\s]/gu, "").trim().slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="line-clamp-2 max-w-xs font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{p.category}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {p.priceMin === p.priceMax
                        ? formatVND(p.priceMin)
                        : `${formatVND(p.priceMin)} - ${formatVND(p.priceMax)}`}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.featured ? <span className="font-bold text-primary">Có</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setShowForm(true);
                        }}
                        className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold hover:border-primary hover:text-primary"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="ml-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </AdminLayout>
  );
}

function ProductForm({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category || CATEGORIES[0],
    description: product?.description || "",
    priceMin: product ? String(product.priceMin) : "",
    priceMax: product ? String(product.priceMax) : "",
    stock: product ? String(product.stock) : "0",
    featured: product?.featured || false,
    image: product?.image || "",
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name: form.name,
        category: form.category,
        description: form.description,
        priceMin: Number(form.priceMin),
        priceMax: Number(form.priceMax) || Number(form.priceMin),
        stock: Number(form.stock),
        featured: form.featured,
        image: form.image || null,
      };
      const res = product
        ? await fetch(`/api/admin/products/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi lưu sản phẩm.");
      toast({ title: product ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm mới" });
      onSaved();
    } catch (err) {
      toast({ title: "Lỗi", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-background p-6 shadow-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">
            {product ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted">
            Đóng
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <L label="Tên sản phẩm">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input" />
          </L>
          <L label="Danh mục">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </L>
          <L label="Mô tả">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="input min-h-[80px] resize-y" />
          </L>
          <L label="Đường dẫn ảnh (vd: /images/products/p01.jpg)">
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/images/products/p01.jpg" className="input" />
          </L>
          {form.image && (
            <img src={form.image} alt="preview" className="h-24 w-24 rounded-lg object-cover ring-1 ring-border" />
          )}
          <div className="grid grid-cols-2 gap-3">
            <L label="Giá thấp nhất (VNĐ)">
              <input type="number" min={0} value={form.priceMin} onChange={(e) => setForm({ ...form, priceMin: e.target.value })} required className="input" />
            </L>
            <L label="Giá cao nhất (VNĐ)">
              <input type="number" min={0} value={form.priceMax} onChange={(e) => setForm({ ...form, priceMax: e.target.value })} className="input" />
            </L>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <L label="Tồn kho">
              <input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" />
            </L>
            <L label="Sản phẩm hot">
              <label className="flex h-[42px] items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                <span className="text-sm">Đánh dấu là sản phẩm hot</span>
              </label>
            </L>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold">
              Hủy
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60">
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--input));
          background: hsl(var(--background));
          padding: 0.55rem 0.7rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.25);
        }
      `}</style>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}
