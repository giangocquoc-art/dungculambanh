import { clearSession } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";

// POST /api/auth/logout
export const POST = apiHandler(async () => {
  await clearSession();
  return Response.json({ ok: true });
});
