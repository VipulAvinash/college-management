import { NextRequest } from "next/server";
import { authService } from "@/services/auth.service";
import { loginSchema } from "@/lib/validations/auth.validation";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const input = loginSchema.parse(body);
  const admin = await authService.login(input);
  return ok(admin);
});
