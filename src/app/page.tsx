"use client";

import { useRouter } from "@/lib/router";
import { useAuthBootstrap } from "@/lib/auth-client";
import { useAuth } from "@/lib/store";

import { StoreHeader } from "@/components/wind/shared/store-header";
import { StoreFooter } from "@/components/wind/shared/store-footer";
import { HomeView } from "@/components/wind/store/home-view";
import { ProductsView } from "@/components/wind/store/products-view";
import { ProductDetailView } from "@/components/wind/store/product-detail-view";
import { CartView } from "@/components/wind/store/cart-view";
import { AuthView } from "@/components/wind/store/auth-view";
import { AccountView } from "@/components/wind/store/account-view";
import { AboutView } from "@/components/wind/store/about-view";
import { ContactView } from "@/components/wind/store/contact-view";

import { AdminLogin } from "@/components/wind/admin/admin-login";
import { AdminDashboard } from "@/components/wind/admin/admin-dashboard";
import { AdminStats } from "@/components/wind/admin/admin-stats";
import { AdminProducts } from "@/components/wind/admin/admin-products";
import { AdminOrders } from "@/components/wind/admin/admin-orders";
import { AdminUsers } from "@/components/wind/admin/admin-users";

export default function Home() {
  useAuthBootstrap();
  const { route } = useRouter();
  const { user, loading } = useAuth();

  const seg = route.segments;
  const first = seg[0] || "";

  // ===== ADMIN AREA =====
  if (first === "admin") {
    const sub = seg[1] || "";
    // Trang đăng nhập admin — không yêu cầu đã login
    if (sub === "login") {
      return <AdminLogin />;
    }
    // Các trang admin khác — component tự kiểm tra quyền (chuyển hướng nếu chưa phải admin)
    if (sub === "stats") return <AdminStats />;
    if (sub === "products") return <AdminProducts />;
    if (sub === "orders") return <AdminOrders />;
    if (sub === "users") return <AdminUsers />;
    // /admin mặc định -> dashboard
    return <AdminDashboard />;
  }

  // ===== STORE AREA =====
  let content: React.ReactNode;

  if (first === "products") {
    const slug = seg[1];
    content = slug ? <ProductDetailView slug={slug} /> : <ProductsView />;
  } else if (first === "cart") {
    content = <CartView />;
  } else if (first === "login") {
    const queryPart = route.path.includes("?") ? route.path.split("?")[1] : "";
    const redirect = new URLSearchParams(queryPart).get("redirect") || undefined;
    content = <AuthView mode="login" redirect={redirect} />;
  } else if (first === "register") {
    content = <AuthView mode="register" />;
  } else if (first === "account") {
    content = <AccountView />;
  } else if (first === "about") {
    content = <AboutView />;
  } else if (first === "contact") {
    content = <ContactView />;
  } else {
    content = <HomeView />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">{content}</main>
      <StoreFooter />
    </div>
  );
}
