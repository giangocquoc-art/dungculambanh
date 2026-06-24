import { NextResponse } from "next/server";
import { ResponseError } from "@/lib/auth";

type Handler = (req: Request, ctx: any) => Promise<unknown>;

/**
 * Bọc route handler để xử lý lỗi thống nhất:
 * - ResponseError -> JSON { error } với status tương ứng (401/403/404/400/409)
 * - Lỗi khác -> 500
 */
export function apiHandler(handler: Handler) {
  return async (req: Request, ctx: any): Promise<Response> => {
    try {
      const result = await handler(req, ctx);
      if (result instanceof Response) return result;
      return NextResponse.json(result);
    } catch (err) {
      if (err instanceof ResponseError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      console.error("API error:", err);
      return NextResponse.json({ error: "Lỗi máy chủ, vui lòng thử lại." }, { status: 500 });
    }
  };
}
