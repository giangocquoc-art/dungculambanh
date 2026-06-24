import { db } from "@/lib/db";
import { requireAdmin, ResponseError } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

// POST /api/admin/products — tạo sản phẩm (chỉ ADMIN)
export const POST = apiHandler(async (req) => {
  await requireAdmin();
  const body = await req.json();
  const { name, category, description, priceMin, priceMax, stock, featured, image } = body;
  if (!name || !category || !description) {
    throw new ResponseError(400, "Vui lòng nhập tên, danh mục và mô tả.");
  }
  const pmin = Math.max(0, Math.floor(Number(priceMin) || 0));
  const pmax = Math.max(pmin, Math.floor(Number(priceMax) || pmin));
  let slug = slugify(String(name));
  let suffix = 1;
  while (await db.product.findUnique({ where: { slug } })) {
    slug = `${slugify(String(name))}-${suffix++}`;
  }
  const product = await db.product.create({
    data: {
      name: String(name),
      slug,
      description: String(description),
      category: String(category),
      priceMin: pmin,
      priceMax: pmax,
      stock: Math.max(0, Math.floor(Number(stock) || 0)),
      featured: Boolean(featured),
      image: image ? String(image) : null,
    },
  });
  return Response.json({ product }, { status: 201 });
});

// GET /api/admin/products — danh sách toàn bộ sản phẩm cho admin (gồm stock)
export const GET = apiHandler(async () => {
  await requireAdmin();
  const items = await db.product.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ items });
});
