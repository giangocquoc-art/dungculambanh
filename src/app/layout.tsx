import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Font Be Vietnam Pro — hỗ trợ tiếng Việt tốt
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wind Baking Tool — Cửa hàng dụng cụ làm bánh",
  description:
    "Wind Baking Tool (Wind Store) chuyên cung cấp khuôn khay nướng bánh, dụng cụ làm bánh, dụng cụ trang trí bánh, bao bì ngành bánh. Đặt trực tiếp trên web nhận giá ưu đãi, phí ship toàn quốc 30.000đ/đơn, thanh toán khi nhận hàng.",
  keywords: [
    "dụng cụ làm bánh",
    "khuôn bánh",
    "khuôn silicone",
    "bao bì bánh",
    "Wind Baking Tool",
    "Wind Store",
    "dụng cụ làm bếp",
  ],
  authors: [{ name: "Wind Baking Tool" }],
  openGraph: {
    title: "Wind Baking Tool — Cửa hàng dụng cụ làm bánh",
    description:
      "Khuôn khay nướng bánh, dụng cụ làm bánh, trang trí bánh, bao bì ngành bánh. Ship toàn quốc 30.000đ/đơn.",
    siteName: "Wind Baking Tool",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
