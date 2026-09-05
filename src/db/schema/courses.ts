import { pgTable, uuid, varchar, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { departments } from "./departments";
import { students } from "./students";

export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 150 }).notNull(),
    code: varchar("code", { length: 20 }).notNull().unique(),
    description: text("description"),
    durationYears: integer("duration_years").notNull(),
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    departmentIdIdx: index("courses_department_id_idx").on(table.departmentId)
  })
);

export const coursesRelations = relations(courses, ({ one, many }) => ({
  department: one(departments, { fields: [courses.departmentId], references: [departments.id] }),
  students: many(students)
}));

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
