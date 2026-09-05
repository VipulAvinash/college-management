import type { PublicUser } from "@/db/schema";

// Single source of truth for "is this admin allowed to do X".
// Today every admin can do everything; this indirection means future
// role/permission granularity only needs to change here.
export function canManageCollegeData(admin: PublicUser): boolean {
  return admin.role === "ADMIN";
}
