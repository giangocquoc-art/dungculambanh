import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

// ===== Thư viện xác thực & phân quyền =====
// Session token dạng HMAC-signed JSON, lưu trong httpOnly cookie.
// Token mang theo { userId, role } — role là cơ sở phân quyền ADMIN/USER.

const SESSION_COOKIE = "wind_session";
const SECRET = process.env.SESSION_SECRET || "wind-baking-tool-dev-secret-change-me";

function toBase64Url(s: string): string {
  return Buffer.from(s).toString("base64url");
}
function fromBase64Url(s: string): string {
  return Buffer.from(s, "base64url").toString("utf8");
}

async function sign(payload: Record<string, unknown>): Promise<string> {
  const data = toBase64Url(JSON.stringify(payload));
  const { createHmac } = await import("crypto");
  const sig = createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

async function verify(token: string): Promise<Record<string, unknown> | null> {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const { createHmac } = await import("crypto");
  const expected = createHmac("sha256", SECRET).update(data).digest("base64url");
  if (sig !== expected) return null;
  try {
    return JSON.parse(fromBase64Url(data));
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(userId: string, role: string): Promise<void> {
  const token = await sign({ userId, role, iat: Date.now() });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  phone?: string | null;
  address?: string | null;
}

/**
 * Lấy người dùng hiện tại từ session cookie.
 * Trả về null nếu chưa đăng nhập.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verify(token);
  if (!payload || typeof payload.userId !== "string") return null;
  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true, role: true, phone: true, address: true },
  });
  if (!user) return null;
  return { ...user, role: user.role as "USER" | "ADMIN" };
}

/**
 * Yêu cầu đăng nhập. Trả về user hoặc ném 401.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new ResponseError(401, "Vui lòng đăng nhập để tiếp tục.");
  }
  return user;
}

/**
 * Yêu cầu quyền ADMIN. Trả về user admin hoặc ném 403.
 * Đây là cổng phân quyền cốt lõi: mọi route admin đều phải gọi hàm này.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new ResponseError(403, "Truy cập bị từ chối. Yêu cầu quyền quản trị.");
  }
  return user;
}

export class ResponseError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export { SESSION_COOKIE };
