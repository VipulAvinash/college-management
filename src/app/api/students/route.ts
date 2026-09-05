import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { studentService } from "@/services/student.service";
import { studentCreateSchema, studentQuerySchema } from "@/lib/validations/student.validation";
import { withErrorHandling } from "@/lib/api/handler";
import { paginated, created } from "@/lib/api/response";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const query = studentQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
  const { rows, pagination } = await studentService.list(query, req.nextUrl.searchParams);
  return paginated(rows, pagination);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const input = studentCreateSchema.parse(body);
  const student = await studentService.create(input);
  return created(student);
});
