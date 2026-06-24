import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

// GET /api/admin/users — danh sách người dùng (chỉ ADMIN)
export const GET = apiHandler(async () => {
  await requireAdmin();
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });
  const ids = users.map((u) => u.id);
  const counts = await db.order.groupBy({
    by: ["userId"],
    where: { userId: { in: ids } },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.userId, c._count._all]));
  const items = users.map((u) => ({ ...u, orderCount: countMap.get(u.id) || 0 }));
  return Response.json({ users: items });
});
