import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { paymentService } from "@/services/payment.service";
import { paymentCreateSchema, paymentQuerySchema } from "@/lib/validations/payment.validation";
import { withErrorHandling } from "@/lib/api/handler";
import { paginated, created } from "@/lib/api/response";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const query = paymentQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
  const { rows, pagination } = await paymentService.list(query, req.nextUrl.searchParams);
  return paginated(rows, pagination);
});

// Records a manual payment and atomically updates the related fee (see payment.service.ts).
export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const input = paymentCreateSchema.parse(body);
  const result = await paymentService.recordPayment(input);
  return created(result);
});
