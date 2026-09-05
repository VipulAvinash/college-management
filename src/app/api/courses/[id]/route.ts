import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { courseService } from "@/services/course.service";
import { courseUpdateSchema } from "@/lib/validations/course.validation";
import { uuidSchema } from "@/lib/validations/common";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: { id: string } };

export const GET = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const course = await courseService.getById(id);
  return ok(course);
});

export const PATCH = withErrorHandling(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const body = await req.json();
  const input = courseUpdateSchema.parse(body);
  const course = await courseService.update(id, input);
  return ok(course);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const deleted = await courseService.delete(id);
  return ok(deleted);
});
