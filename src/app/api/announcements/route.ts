import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { announcementService } from "@/services/announcement.service";
import {
  announcementCreateSchema,
  announcementQuerySchema
} from "@/lib/validations/announcement.validation";
import { withErrorHandling } from "@/lib/api/handler";
import { paginated, created } from "@/lib/api/response";

// Note: for the PUBLIC college website, read announcements via
// announcementService.listPublished() from a server component instead of
// this route, since this route requires admin auth (requirement #19/#20).
export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const query = announcementQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
  const { rows, pagination } = await announcementService.list(query, req.nextUrl.searchParams);
  return paginated(rows, pagination);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const input = announcementCreateSchema.parse(body);
  const announcement = await announcementService.create(input);
  return created(announcement);
});
