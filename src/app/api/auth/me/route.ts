import { getCurrentUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

// GET /api/auth/me — trả về user hiện tại (hoặc null)
export const GET = apiHandler(async () => {
  const user = await getCurrentUser();
  return Response.json({ user });
});
