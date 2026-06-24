import { db } from "@/lib/db";
import { apiHandler } from "@/lib/api-handler";

// GET /api/categories — danh sách danh mục + số lượng sản phẩm
export const GET = apiHandler(async () => {
  const products = await db.product.findMany({ select: { category: true } });
  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.category, (counts.get(p.category) || 0) + 1);
  }
  const categories = Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return Response.json({ categories });
});
