import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

// GET /api/admin/stats — thống kê doanh thu (chỉ ADMIN)
export const GET = apiHandler(async () => {
  await requireAdmin();

  const allOrders = await db.order.findMany({
    select: { status: true, total: true, createdAt: true, shipFee: true },
  });

  // Doanh thu = tổng total của đơn COMPLETED + APPROVED (đã duyệt)
  const revenueOrders = allOrders.filter(
    (o) => o.status === "COMPLETED" || o.status === "APPROVED",
  );
  const totalRevenue = revenueOrders.reduce((s, o) => s + o.total, 0);

  const byStatus = {
    PENDING: allOrders.filter((o) => o.status === "PENDING").length,
    APPROVED: allOrders.filter((o) => o.status === "APPROVED").length,
    REJECTED: allOrders.filter((o) => o.status === "REJECTED").length,
    COMPLETED: allOrders.filter((o) => o.status === "COMPLETED").length,
  };

  const totalOrders = allOrders.length;
  const totalProducts = await db.product.count();
  const totalUsers = await db.user.count({ where: { role: "USER" } });

  // Doanh thu 7 ngày gần nhất
  const days: { label: string; revenue: number; orders: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const start = new Date(today.getTime() - i * 86400000);
    const end = new Date(start.getTime() + 86400000);
    const dayOrders = revenueOrders.filter((o) => {
      const t = o.createdAt.getTime();
      return t >= start.getTime() && t < end.getTime();
    });
    days.push({
      label: `${start.getDate()}/${start.getMonth() + 1}`,
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // Doanh thu theo danh mục (top 5)
  const orderItems = await db.orderItem.findMany({
    where: { order: { status: { in: ["COMPLETED", "APPROVED"] } } },
    include: { product: { select: { category: true } } },
  });
  const catMap = new Map<string, number>();
  for (const oi of orderItems) {
    const cat = oi.product?.category || "Khác";
    catMap.set(cat, (catMap.get(cat) || 0) + oi.unitPrice * oi.quantity);
  }
  const byCategory = Array.from(catMap.entries())
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return Response.json({
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    byStatus,
    last7Days: days,
    byCategory,
    avgOrderValue: revenueOrders.length > 0 ? Math.round(totalRevenue / revenueOrders.length) : 0,
  });
});
