import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { facultyService } from "@/services/faculty.service";
import { facultyUpdateSchema } from "@/lib/validations/faculty.validation";
import { uuidSchema } from "@/lib/validations/common";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: { id: string } };

export const GET = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const member = await facultyService.getById(id);
  return ok(member);
});

export const PATCH = withErrorHandling(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const body = await req.json();
  const input = facultyUpdateSchema.parse(body);
  const member = await facultyService.update(id, input);
  return ok(member);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const deleted = await facultyService.delete(id);
  return ok(deleted);
});
