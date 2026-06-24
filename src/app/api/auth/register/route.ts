import { db } from "@/lib/db";
import { hashPassword, createSession, ResponseError } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

// POST /api/auth/register — đăng ký tài khoản USER (không thể tự đăng ký ADMIN)
export const POST = apiHandler(async (req) => {
  const { name, email, password, phone, address } = await req.json();
  if (!name || !email || !password) {
    throw new ResponseError(400, "Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
  }
  if (String(password).length < 6) {
    throw new ResponseError(400, "Mật khẩu phải có ít nhất 6 ký tự.");
  }
  const existing = await db.user.findUnique({ where: { email: String(email).toLowerCase() } });
  if (existing) {
    throw new ResponseError(409, "Email đã được đăng ký.");
  }
  const hash = await hashPassword(String(password));
  // Bảo mật phân quyền: register luôn tạo USER, không cho phép chọn role
  const user = await db.user.create({
    data: {
      name: String(name),
      email: String(email).toLowerCase(),
      password: hash,
      phone: phone ? String(phone) : null,
      address: address ? String(address) : null,
      role: "USER",
    },
  });
  await createSession(user.id, user.role);
  return Response.json(
    {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address },
    },
    { status: 201 },
  );
});
