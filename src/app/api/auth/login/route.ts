import { db } from "@/lib/db";
import { comparePassword, createSession, ResponseError } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

// POST /api/auth/login — đăng nhập cho cả USER và ADMIN
export const POST = apiHandler(async (req) => {
  const { email, password } = await req.json();
  if (!email || !password) {
    throw new ResponseError(400, "Vui lòng nhập email và mật khẩu.");
  }
  const user = await db.user.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!user) {
    throw new ResponseError(401, "Email hoặc mật khẩu không đúng.");
  }
  const ok = await comparePassword(String(password), user.password);
  if (!ok) {
    throw new ResponseError(401, "Email hoặc mật khẩu không đúng.");
  }
  await createSession(user.id, user.role);
  return Response.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address },
  });
});
