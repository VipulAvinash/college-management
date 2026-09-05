import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { feeService } from "@/services/fee.service";
import { feeCreateSchema, feeQuerySchema } from "@/lib/validations/fee.validation";
import { withErrorHandling } from "@/lib/api/handler";
import { paginated, created } from "@/lib/api/response";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const query = feeQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
  const { rows, pagination } = await feeService.list(query, req.nextUrl.searchParams);
  return paginated(rows, pagination);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const input = feeCreateSchema.parse(body);
  const fee = await feeService.create(input);
  return created(fee);
});
