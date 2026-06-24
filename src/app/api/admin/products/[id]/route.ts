import { db } from "@/lib/db";
import { requireAdmin, ResponseError } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

// PUT /api/admin/products/[id] — sửa sản phẩm (chỉ ADMIN)
export const PUT = apiHandler(async (req, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json();
  const { name, category, description, priceMin, priceMax, stock, featured } = body;

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) throw new ResponseError(404, "Không tìm thấy sản phẩm.");

  const pmin = priceMin !== undefined ? Math.max(0, Math.floor(Number(priceMin) || 0)) : undefined;
  const pmax =
    priceMax !== undefined
      ? Math.max(pmin ?? existing.priceMin, Math.floor(Number(priceMax) || 0))
      : undefined;

  const product = await db.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: String(name) }),
      ...(category !== undefined && { category: String(category) }),
      ...(description !== undefined && { description: String(description) }),
      ...(pmin !== undefined && { priceMin: pmin }),
      ...(pmax !== undefined && { priceMax: pmax }),
      ...(stock !== undefined && { stock: Math.max(0, Math.floor(Number(stock) || 0)) }),
      ...(featured !== undefined && { featured: Boolean(featured) }),
    },
  });
  return Response.json({ product });
});

// DELETE /api/admin/products/[id] — xóa sản phẩm (chỉ ADMIN)
export const DELETE = apiHandler(async (_req, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await params;
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) throw new ResponseError(404, "Không tìm thấy sản phẩm.");

  const inOrders = await db.orderItem.count({ where: { productId: id } });
  if (inOrders > 0) {
    throw new ResponseError(409, `Không thể xóa: sản phẩm đã có trong ${inOrders} đơn hàng.`);
  }

  await db.product.delete({ where: { id } });
  return Response.json({ ok: true });
});
