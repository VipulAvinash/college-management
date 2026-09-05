import { authService } from "@/services/auth.service";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const POST = withErrorHandling(async () => {
  await authService.logout();
  return ok({ message: "Logged out successfully" });
});
