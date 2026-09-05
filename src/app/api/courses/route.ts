import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { courseService } from "@/services/course.service";
import { courseCreateSchema } from "@/lib/validations/course.validation";
import { withErrorHandling } from "@/lib/api/handler";
import { ok, created } from "@/lib/api/response";

export const GET = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const departmentId = req.nextUrl.searchParams.get("departmentId") ?? undefined;
  const courses = await courseService.list(departmentId);
  return ok(courses);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  await requireAdmin();
  const body = await req.json();
  const input = courseCreateSchema.parse(body);
  const course = await courseService.create(input);
  return created(course);
});
