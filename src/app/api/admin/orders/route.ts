import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

// GET /api/admin/orders — danh sách toàn bộ đơn hàng (chỉ ADMIN)
export const GET = apiHandler(async (req) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") where.status = status;
  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });
  return Response.json({ orders });
});
