"use client";

import { useRouter } from "@/lib/router";

export function ContactView() {
  const { push } = useRouter();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Liên hệ</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Wind Baking Tool — sẵn sàng hỗ trợ bạn
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold">Thông tin liên hệ</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Tên cửa hàng</dt>
              <dd className="font-semibold">Wind Baking Tool (Wind Store)</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Hotline</dt>
              <dd className="font-semibold text-primary">0941 806 169</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Website</dt>
              <dd className="font-semibold">windbakingtool.com</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Lĩnh vực</dt>
              <dd className="font-semibold">Dụng cụ làm bánh, dụng cụ làm bếp</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/40 p-6">
          <h2 className="text-lg font-bold">Chính sách mua hàng</h2>
          <ul className="mt-4 space-y-3 text-sm text-foreground/85">
            <li>• Đặt trực tiếp trên web để nhận giá ưu đãi.</li>
            <li>• Phí ship toàn quốc cố định 30.000đ / đơn đặt.</li>
            <li>• Thanh toán khi nhận hàng (COD).</li>
            <li>• Hỗ trợ tư vấn các loại khuôn khay, dụng cụ phù hợp.</li>
          </ul>
          <button
            onClick={() => push("/products")}
            className="mt-5 w-full rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Xem sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
