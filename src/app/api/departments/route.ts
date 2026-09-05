import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { departmentService } from "@/services/department.service";
import { departmentCreateSchema } from "@/lib/validations/department.validation";
import { withErrorHandling } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const departments = await departmentService.list();
  return ok(departments);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const input = departmentCreateSchema.parse(body);
  const department = await departmentService.create(input);
  return created(department);
});
