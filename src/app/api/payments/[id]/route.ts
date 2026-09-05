import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { paymentService } from "@/services/payment.service";
import { uuidSchema } from "@/lib/validations/common";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: { id: string } };

export const GET = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const payment = await paymentService.getById(id);
  return ok(payment);
});
