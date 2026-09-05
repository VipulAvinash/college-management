import { eq, count } from "drizzle-orm";
import { db } from "@/db";
import { departments, courses, faculty, students, type NewDepartment } from "@/db/schema";

export const departmentRepository = {
  async findAll() {
    return db.select().from(departments).orderBy(departments.name);
  },

  async findById(id: string) {
    const [row] = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
    return row ?? null;
  },

  async findByCode(code: string) {
    const [row] = await db.select().from(departments).where(eq(departments.code, code)).limit(1);
    return row ?? null;
  },

  async create(data: NewDepartment) {
    const [row] = await db.insert(departments).values(data).returning();
    return row;
  },

  async update(id: string, data: Partial<NewDepartment>) {
    const [row] = await db
      .update(departments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(departments.id, id))
      .returning();
    return row ?? null;
  },

  async delete(id: string) {
    const [row] = await db.delete(departments).where(eq(departments.id, id)).returning();
    return row ?? null;
  },

  /** Counts of dependent rows, used to decide whether deletion is safe. */
  async countDependents(id: string) {
    const [courseCount] = await db
      .select({ value: count() })
      .from(courses)
      .where(eq(courses.departmentId, id));
    const [facultyCount] = await db
      .select({ value: count() })
      .from(faculty)
      .where(eq(faculty.departmentId, id));
    const [studentCount] = await db
      .select({ value: count() })
      .from(students)
      .where(eq(students.departmentId, id));

    return {
      courses: courseCount?.value ?? 0,
      faculty: facultyCount?.value ?? 0,
      students: studentCount?.value ?? 0
    };
  }
};
