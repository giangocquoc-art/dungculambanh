"use client";

import { useRouter } from "@/lib/router";

export function AboutView() {
  const { push } = useRouter();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Giới thiệu Wind Baking Tool</h1>
      <p className="mt-2 text-sm text-muted-foreground">Wind Store — Cửa hàng dụng cụ làm bánh</p>

      <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85">
        <p>
          <span className="font-bold text-primary">Wind Baking Tool</span> (Wind Store) là cửa hàng
          chuyên cung cấp các loại khuôn khay nướng bánh, dụng cụ làm bánh, các dụng cụ hỗ trợ trang
          trí bánh, bao bì — túi hộp ngành bánh và một số mặt hàng dụng cụ làm bánh khác.
        </p>
        <p>
          Khách hàng có thể đặt trực tiếp trên web để nhận giá ưu đãi. Phí ship toàn quốc cố định{" "}
          <span className="font-bold">30.000đ / đơn đặt</span>, thanh toán khi nhận hàng.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Info title="Phí ship toàn quốc" value="30.000đ / đơn" />
        <Info title="Thanh toán" value="COD — nhận hàng trả tiền" />
        <Info title="Hotline" value="0941 806 169" />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6">
        <h2 className="text-lg font-bold">Danh mục sản phẩm chính</h2>
        <ul className="mt-3 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
          {[
            "Nguyên liệu làm bánh",
            "Dụng cụ pha chế",
            "Khuôn rau câu, khuôn silicone",
            "Khuôn nướng bánh (đúc, chống dính, nhôm gia công)",
            "Dụng cụ cơ bản",
            "Dụng cụ đo lường",
            "Bao bì đóng gói (túi, hộp đựng bánh)",
            "Dụng cụ trang trí bánh kem (đuôi bắt hoa...)",
          ].map((c) => (
            <li key={c} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => push("/products")}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          Xem sản phẩm ngay
        </button>
      </div>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="mt-1 text-lg font-extrabold text-primary">{value}</div>
    </div>
  );
}
