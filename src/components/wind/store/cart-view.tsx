"use client";

import { useState } from "react";
import { useRouter } from "@/lib/router";
import { useCart, useAuth } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { formatVND } from "@/lib/format";

const SHIP_FEE = 30000;

export function CartView() {
  const { push } = useRouter();
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const user = useAuth((s) => s.user);
  const { toast } = useToast();

  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    customerName: user?.name || "",
    customerPhone: user?.phone || "",
    customerAddress: user?.address || "",
    note: "",
  });

  const subtotal = items.reduce((s, i) => s + i.priceMin * i.quantity, 0);
  const total = subtotal + (items.length > 0 ? SHIP_FEE : 0);

  const onPlace = async () => {
    if (!user) {
      toast({ title: "Vui lòng đăng nhập để đặt hàng", variant: "destructive" });
      push("/login?redirect=/cart");
      return;
    }
    if (!form.customerName || !form.customerPhone || !form.customerAddress) {
      toast({ title: "Vui lòng nhập đầy đủ thông tin nhận hàng", variant: "destructive" });
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đặt hàng thất bại.");
      clear();
      toast({ title: "Đặt hàng thành công!", description: `Mã đơn: ${data.order.code}` });
      push("/account");
    } catch (e) {
      toast({ title: "Đặt hàng lỗi", description: (e as Error).message, variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-secondary text-3xl font-extrabold text-primary/60">
          0
        </div>
        <h1 className="mt-6 text-2xl font-extrabold">Giỏ hàng trống</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bạn chưa có sản phẩm nào trong giỏ. Hãy khám phá cửa hàng nhé!
        </p>
        <button
          onClick={() => push("/products")}
          className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Giỏ hàng</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="hidden grid-cols-12 gap-4 border-b border-border bg-secondary/50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:grid">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Tạm tính</div>
            </div>
            {items.map((item) => (
              <div
                key={item.productId}
                className="grid grid-cols-12 items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
              >
                <div className="col-span-12 sm:col-span-6 flex items-center gap-3">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary text-lg font-extrabold text-primary/70">
                    {item.name.replace(/[^\p{L}\s]/gu, "").trim().slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <button
                      onClick={() => push(`/products/${item.slug}`)}
                      className="line-clamp-2 text-left text-sm font-semibold hover:text-primary"
                    >
                      {item.name}
                    </button>
                    <div className="mt-0.5 text-xs text-muted-foreground">{item.category}</div>
                    <button
                      onClick={() => remove(item.productId)}
                      className="mt-1 text-xs font-medium text-red-600 hover:underline sm:hidden"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <div className="col-span-4 text-center text-sm sm:col-span-2">
                  {formatVND(item.priceMin)}
                </div>
                <div className="col-span-4 flex justify-center sm:col-span-2">
                  <div className="flex items-center rounded-md border border-border">
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="grid h-8 w-8 place-items-center font-bold hover:bg-muted"
                    >
                      −
                    </button>
                    <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center font-bold hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-span-4 text-right text-sm font-bold sm:col-span-2">
                  {formatVND(item.priceMin * item.quantity)}
                  <button
                    onClick={() => remove(item.productId)}
                    className="ml-2 hidden text-xs font-medium text-red-600 hover:underline sm:inline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between">
            <button
              onClick={() => push("/products")}
              className="text-sm font-semibold text-primary hover:underline"
            >
              ← Tiếp tục mua sắm
            </button>
            <button
              onClick={clear}
              className="text-sm font-medium text-muted-foreground hover:text-red-600"
            >
              Xóa toàn bộ giỏ
            </button>
          </div>
        </div>

        {/* Thanh toán */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-border bg-card p-5">
            <h2 className="text-base font-bold">Thông tin đặt hàng</h2>
            {!user && (
              <div className="mt-3 rounded-lg border border-primary/30 bg-primary/8 p-3 text-xs text-foreground/80">
                Vui lòng{" "}
                <button
                  onClick={() => push("/login?redirect=/cart")}
                  className="font-bold text-primary underline"
                >
                  đăng nhập
                </button>{" "}
                để đặt hàng.
              </div>
            )}
            <div className="mt-4 space-y-3">
              <Field label="Họ tên người nhận">
                <input
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="input"
                  placeholder="Nguyễn Văn A"
                />
              </Field>
              <Field label="Số điện thoại">
                <input
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className="input"
                  placeholder="09xx xxx xxx"
                />
              </Field>
              <Field label="Địa chỉ nhận hàng">
                <textarea
                  value={form.customerAddress}
                  onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
                  className="input min-h-[72px] resize-y"
                  placeholder="Số nhà, đường, phường, quận, thành phố"
                />
              </Field>
              <Field label="Ghi chú (không bắt buộc)">
                <input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="input"
                  placeholder="Ví dụ: gọi trước khi giao"
                />
              </Field>
            </div>

            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <Row label="Tạm tính" value={formatVND(subtotal)} />
              <Row label="Phí ship toàn quốc" value={formatVND(SHIP_FEE)} />
              <div className="flex items-center justify-between border-t border-border pt-3 text-base font-extrabold">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatVND(total)}</span>
              </div>
            </div>

            <button
              onClick={onPlace}
              disabled={placing}
              className="mt-5 w-full rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {placing ? "Đang đặt hàng..." : "Đặt hàng (COD)"}
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Thanh toán khi nhận hàng · Phí ship {formatVND(SHIP_FEE)}
            </p>
          </div>
        </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
