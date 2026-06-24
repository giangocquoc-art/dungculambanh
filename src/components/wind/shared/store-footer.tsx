"use client";

import { useRouter } from "@/lib/router";

const FOOTER_LINKS = [
  { label: "Trang chủ", path: "/" },
  { label: "Sản phẩm", path: "/products" },
  { label: "Giới thiệu", path: "/about" },
  { label: "Liên hệ", path: "/contact" },
];

/** Footer cửa hàng — sticky dưới cùng, đẩy xuống tự nhiên khi nội dung dài */
export function StoreFooter() {
  const { push } = useRouter();
  return (
    <footer className="mt-auto border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Cột 1: thương hiệu */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary font-extrabold text-primary-foreground">
                W
              </span>
              <div className="leading-none">
                <div className="text-base font-extrabold tracking-tight">WIND BAKING TOOL</div>
                <div className="text-xs text-muted-foreground">Cửa hàng dụng cụ làm bánh</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Wind Store chuyên cung cấp khuôn khay nướng bánh, dụng cụ làm bánh, dụng cụ trang trí
              bánh, bao bì ngành bánh. Đặt trực tiếp trên web nhận giá ưu đãi.
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              Hotline: <span className="text-primary">0941 806 169</span>
            </p>
          </div>

          {/* Cột 2: liên kết */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-foreground">Liên kết</h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.map((l) => (
                <li key={l.path}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      push(l.path);
                    }}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: chính sách */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-foreground">Chính sách</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Phí ship toàn quốc cố định 30.000đ / đơn</li>
              <li>Thanh toán khi nhận hàng (COD)</li>
              <li>Đặt trực tiếp trên web để nhận giá ưu đãi</li>
              <li>Hỗ trợ tư vấn: 0941 806 169</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Wind Baking Tool. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Dữ liệu tham khảo từ windbakingtool.com
          </p>
        </div>
      </div>
    </footer>
  );
}
