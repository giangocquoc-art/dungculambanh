import { db } from "@/lib/db";
import { requireUser, ResponseError } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

// POST /api/orders — tạo đơn hàng (yêu cầu đăng nhập USER)
export const POST = apiHandler(async (req) => {
  const user = await requireUser();
  const body = await req.json();
  const { items, customerName, customerPhone, customerAddress, note } = body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ResponseError(400, "Giỏ hàng đang trống.");
  }
  if (!customerName || !customerPhone || !customerAddress) {
    throw new ResponseError(400, "Vui lòng nhập đầy đủ thông tin nhận hàng.");
  }

  // Lấy sản phẩm thật từ DB để tính giá (không tin giá từ client)
  const productIds = items.map((i: { productId: string }) => i.productId);
  const products = await db.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const p = productMap.get(item.productId);
    if (!p) throw new ResponseError(400, "Sản phẩm không tồn tại.");
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 0));
    if (p.stock < qty) {
      throw new ResponseError(400, `Sản phẩm "${p.name}" không đủ số lượng trong kho.`);
    }
    total += p.priceMin * qty;
    orderItems.push({
      productId: p.id,
      productName: p.name,
      unitPrice: p.priceMin,
      quantity: qty,
    });
  }
  const shipFee = 30000;
  total += shipFee;

  // Sinh mã đơn
  const count = await db.order.count();
  const code = `WIND-${String(count + 1).padStart(4, "0")}`;

  const order = await db.order.create({
    data: {
      code,
      userId: user.id,
      customerName: String(customerName),
      customerPhone: String(customerPhone),
      customerAddress: String(customerAddress),
      note: note ? String(note) : null,
      total,
      shipFee,
      status: "PENDING",
      orderItems: { create: orderItems },
    },
    include: { orderItems: true },
  });

  // Giảm tồn kho
  for (const item of orderItems) {
    await db.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  return Response.json({ order }, { status: 201 });
});

// GET /api/orders — danh sách đơn của USER hiện tại
export const GET = apiHandler(async () => {
  const user = await requireUser();
  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { orderItems: true },
  });
  return Response.json({ orders });
});
