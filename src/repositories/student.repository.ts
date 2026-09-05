import { and, count, eq, ilike, or, SQL } from "drizzle-orm";
import { db } from "@/db";
import { students, type NewStudent } from "@/db/schema";
import type { StudentQueryInput } from "@/lib/validations/student.validation";

function buildFilters(query: Omit<StudentQueryInput, "page" | "limit">) {
  const conditions: SQL[] = [];

  if (query.search) {
    const term = `%${query.search}%`;
    conditions.push(
      or(
        ilike(students.studentId, term),
        ilike(students.firstName, term),
        ilike(students.lastName, term),
        ilike(students.email, term),
        ilike(students.phone, term)
      )!
    );
  }
  if (query.departmentId) conditions.push(eq(students.departmentId, query.departmentId));
  if (query.courseId) conditions.push(eq(students.courseId, query.courseId));
  if (query.year !== undefined) conditions.push(eq(students.year, query.year));
  if (query.semester !== undefined) conditions.push(eq(students.semester, query.semester));
  if (query.status) conditions.push(eq(students.status, query.status));

  return conditions.length ? and(...conditions) : undefined;
}

export const studentRepository = {
  /** All filtering/searching happens at the SQL level - never in JS (requirement #11). */
  async findMany(query: StudentQueryInput, limit: number, offset: number) {
    const where = buildFilters(query);

    const [rows, countRes] = await Promise.all([
      db
        .select()
        .from(students)
        .where(where)
        .orderBy(students.createdAt)
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(students).where(where)
    ]);
    const total = countRes[0]?.value ?? 0;

    return { rows, total };
  },

  async findById(id: string) {
    const [row] = await db.select().from(students).where(eq(students.id, id)).limit(1);
    return row ?? null;
  },

  async findByStudentId(studentId: string) {
    const [row] = await db.select().from(students).where(eq(students.studentId, studentId)).limit(1);
    return row ?? null;
  },

  async findByEmail(email: string) {
    const [row] = await db.select().from(students).where(eq(students.email, email)).limit(1);
    return row ?? null;
  },

  async create(data: NewStudent) {
    const [row] = await db.insert(students).values(data).returning();
    return row;
  },

  async update(id: string, data: Partial<NewStudent>) {
    const [row] = await db
      .update(students)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return row ?? null;
  },

  async delete(id: string) {
    const [row] = await db.delete(students).where(eq(students.id, id)).returning();
    return row ?? null;
  },

  async countRecent(limit = 5) {
    return db.select().from(students).orderBy(students.createdAt).limit(limit);
  }
};
