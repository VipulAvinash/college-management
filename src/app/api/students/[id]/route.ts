import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { studentService } from "@/services/student.service";
import { studentUpdateSchema } from "@/lib/validations/student.validation";
import { uuidSchema } from "@/lib/validations/common";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: { id: string } };

export const GET = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const student = await studentService.getById(id);
  return ok(student);
});

export const PATCH = withErrorHandling(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const body = await req.json();
  const input = studentUpdateSchema.parse(body);
  const student = await studentService.update(id, input);
  return ok(student);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const deleted = await studentService.delete(id);
  return ok(deleted);
});
