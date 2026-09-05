import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { feeService } from "@/services/fee.service";
import { feeUpdateSchema } from "@/lib/validations/fee.validation";
import { uuidSchema } from "@/lib/validations/common";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: { id: string } };

export const GET = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const fee = await feeService.getById(id);
  return ok(fee);
});

export const PATCH = withErrorHandling(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const body = await req.json();
  const input = feeUpdateSchema.parse(body);
  const fee = await feeService.update(id, input);
  return ok(fee);
});
