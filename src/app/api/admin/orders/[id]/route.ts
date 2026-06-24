import { db } from "@/lib/db";
import { requireAdmin, ResponseError } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

const VALID = new Set(["PENDING", "APPROVED", "REJECTED", "COMPLETED"]);

// GET /api/admin/orders/[id] — chi tiết đơn (chỉ ADMIN)
export const GET = apiHandler(async (_req, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { orderItems: true, user: { select: { name: true, email: true } } },
  });
  if (!order) throw new ResponseError(404, "Không tìm thấy đơn hàng.");
  return Response.json({ order });
});

// PATCH /api/admin/orders/[id] — duyệt / từ chối / hoàn thành đơn (chỉ ADMIN)
export const PATCH = apiHandler(async (req, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;
  const { status } = await req.json();
  if (!VALID.has(String(status))) {
    throw new ResponseError(400, "Trạng thái không hợp lệ.");
  }
  const existing = await db.order.findUnique({ where: { id } });
  if (!existing) throw new ResponseError(404, "Không tìm thấy đơn hàng.");

  // Nếu từ chối đơn -> hoàn trả tồn kho
  if (String(status) === "REJECTED" && existing.status !== "REJECTED") {
    const items = await db.orderItem.findMany({ where: { orderId: id } });
    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
  }

  const order = await db.order.update({
    where: { id },
    data: { status: String(status) },
  });
  return Response.json({ order });
});
