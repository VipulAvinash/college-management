import { eq, count } from "drizzle-orm";
import { db } from "@/db";
import { courses, students, type NewCourse } from "@/db/schema";

export const courseRepository = {
  async findAll(departmentId?: string) {
    const query = db.select().from(courses).orderBy(courses.name);
    if (departmentId) {
      return query.where(eq(courses.departmentId, departmentId));
    }
    return query;
  },

  async findById(id: string) {
    const [row] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return row ?? null;
  },

  async findByCode(code: string) {
    const [row] = await db.select().from(courses).where(eq(courses.code, code)).limit(1);
    return row ?? null;
  },

  async create(data: NewCourse) {
    const [row] = await db.insert(courses).values(data).returning();
    return row;
  },

  async update(id: string, data: Partial<NewCourse>) {
    const [row] = await db
      .update(courses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return row ?? null;
  },

  async delete(id: string) {
    const [row] = await db.delete(courses).where(eq(courses.id, id)).returning();
    return row ?? null;
  },

  async countDependentStudents(id: string) {
    const [row] = await db.select({ value: count() }).from(students).where(eq(students.courseId, id));
    return row?.value ?? 0;
  }
};
