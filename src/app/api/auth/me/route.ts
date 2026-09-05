import { requireAdmin } from "@/lib/auth/session";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const GET = withErrorHandling(async () => {
  const admin = await requireAdmin();
  return ok(admin);
});
