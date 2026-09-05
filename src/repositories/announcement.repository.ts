import { and, count, eq, SQL } from "drizzle-orm";
import { db } from "@/db";
import { announcements, type NewAnnouncement } from "@/db/schema";
import type { AnnouncementQueryInput } from "@/lib/validations/announcement.validation";

function buildFilters(query: Omit<AnnouncementQueryInput, "page" | "limit">) {
  const conditions: SQL[] = [];
  if (query.published !== undefined) conditions.push(eq(announcements.published, query.published));
  return conditions.length ? and(...conditions) : undefined;
}

export const announcementRepository = {
  async findMany(query: AnnouncementQueryInput, limit: number, offset: number) {
    const where = buildFilters(query);
    const [rows, countRes] = await Promise.all([
      db
        .select()
        .from(announcements)
        .where(where)
        .orderBy(announcements.createdAt)
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(announcements).where(where)
    ]);
    const total = countRes[0]?.value ?? 0;
    return { rows, total };
  },

  async findById(id: string) {
    const [row] = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
    return row ?? null;
  },

  async create(data: NewAnnouncement) {
    const [row] = await db.insert(announcements).values(data).returning();
    return row;
  },

  async update(id: string, data: Partial<NewAnnouncement>) {
    const [row] = await db
      .update(announcements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();
    return row ?? null;
  },

  async delete(id: string) {
    const [row] = await db.delete(announcements).where(eq(announcements.id, id)).returning();
    return row ?? null;
  },

  async findRecent(limit = 5) {
    return db
      .select()
      .from(announcements)
      .where(eq(announcements.published, true))
      .orderBy(announcements.createdAt)
      .limit(limit);
  }
};
