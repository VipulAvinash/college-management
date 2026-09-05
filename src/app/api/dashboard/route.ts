import { requireAdmin } from "@/lib/auth/session";
import { dashboardService } from "@/services/dashboard.service";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const stats = await dashboardService.getStats();
  return ok(stats);
});
