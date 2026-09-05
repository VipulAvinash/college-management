import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { facultyService } from "@/services/faculty.service";
import { facultyCreateSchema, facultyQuerySchema } from "@/lib/validations/faculty.validation";
import { withErrorHandling } from "@/lib/api/handler";
import { paginated, created } from "@/lib/api/response";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const query = facultyQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
  const { rows, pagination } = await facultyService.list(query, req.nextUrl.searchParams);
  return paginated(rows, pagination);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const input = facultyCreateSchema.parse(body);
  const member = await facultyService.create(input);
  return created(member);
});
