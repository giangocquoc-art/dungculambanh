import { db } from "@/lib/db";
import { ResponseError } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

// GET /api/products/[slug] — chi tiết sản phẩm (public)
export const GET = apiHandler(async (_req, { params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) throw new ResponseError(404, "Không tìm thấy sản phẩm.");
  return Response.json({ product });
});
