import { db } from "@/lib/db";
import { apiHandler } from "@/lib/api-handler";

// GET /api/products — danh sách sản phẩm (public)
// Query: ?category= & q= & featured= & limit= & offset=
export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const where: Record<string, unknown> = {};
  if (category && category !== "ALL") where.category = category;
  if (featured === "true") where.featured = true;
  if (q) where.name = { contains: q };

  const [items, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    db.product.count({ where }),
  ]);

  return Response.json({ items, total });
});
