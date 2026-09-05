import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { departmentService } from "@/services/department.service";
import { departmentUpdateSchema } from "@/lib/validations/department.validation";
import { uuidSchema } from "@/lib/validations/common";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: { id: string } };

export const GET = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const department = await departmentService.getById(id);
  return ok(department);
});

export const PATCH = withErrorHandling(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const body = await req.json();
  const input = departmentUpdateSchema.parse(body);
  const department = await departmentService.update(id, input);
  return ok(department);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const deleted = await departmentService.delete(id);
  return ok(deleted);
});
