import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { announcementService } from "@/services/announcement.service";
import { announcementUpdateSchema } from "@/lib/validations/announcement.validation";
import { uuidSchema } from "@/lib/validations/common";
import { withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

type Ctx = { params: { id: string } };

export const GET = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const announcement = await announcementService.getById(id);
  return ok(announcement);
});

export const PATCH = withErrorHandling(async (req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const body = await req.json();
  const input = announcementUpdateSchema.parse(body);
  const announcement = await announcementService.update(id, input);
  return ok(announcement);
});

export const DELETE = withErrorHandling(async (_req: NextRequest, ctx: Ctx) => {
  await requireAdmin();
  const id = uuidSchema.parse(ctx.params.id);
  const deleted = await announcementService.delete(id);
  return ok(deleted);
});
