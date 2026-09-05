import { and, count, eq, ilike, or, SQL } from "drizzle-orm";
import { db } from "@/db";
import { faculty, type NewFaculty } from "@/db/schema";
import type { FacultyQueryInput } from "@/lib/validations/faculty.validation";

function buildFilters(query: Omit<FacultyQueryInput, "page" | "limit">) {
  const conditions: SQL[] = [];

  if (query.search) {
    const term = `%${query.search}%`;
    conditions.push(
      or(
        ilike(faculty.employeeId, term),
        ilike(faculty.firstName, term),
        ilike(faculty.lastName, term),
        ilike(faculty.email, term)
      )!
    );
  }
  if (query.departmentId) conditions.push(eq(faculty.departmentId, query.departmentId));
  if (query.status) conditions.push(eq(faculty.status, query.status));

  return conditions.length ? and(...conditions) : undefined;
}

export const facultyRepository = {
  async findMany(query: FacultyQueryInput, limit: number, offset: number) {
    const where = buildFilters(query);

    const [rows, countRes] = await Promise.all([
      db.select().from(faculty).where(where).orderBy(faculty.createdAt).limit(limit).offset(offset),
      db.select({ value: count() }).from(faculty).where(where)
    ]);
    const total = countRes[0]?.value ?? 0;

    return { rows, total };
  },

  async findById(id: string) {
    const [row] = await db.select().from(faculty).where(eq(faculty.id, id)).limit(1);
    return row ?? null;
  },

  async findByEmployeeId(employeeId: string) {
    const [row] = await db.select().from(faculty).where(eq(faculty.employeeId, employeeId)).limit(1);
    return row ?? null;
  },

  async findByEmail(email: string) {
    const [row] = await db.select().from(faculty).where(eq(faculty.email, email)).limit(1);
    return row ?? null;
  },

  async create(data: NewFaculty) {
    const [row] = await db.insert(faculty).values(data).returning();
    return row;
  },

  async update(id: string, data: Partial<NewFaculty>) {
    const [row] = await db
      .update(faculty)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(faculty.id, id))
      .returning();
    return row ?? null;
  },

  async delete(id: string) {
    const [row] = await db.delete(faculty).where(eq(faculty.id, id)).returning();
    return row ?? null;
  }
};
