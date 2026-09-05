import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  integer,
  timestamp,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { studentStatusEnum, genderEnum } from "./enums";
import { departments } from "./departments";
import { courses } from "./courses";
import { fees } from "./fees";

// Students are DATA ONLY - no password/auth fields, and no relation back
// to `users`, by design (see requirement #2 / #38).
export const students = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: varchar("student_id", { length: 30 }).notNull().unique(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }).notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    gender: genderEnum("gender").notNull(),
    address: text("address"),
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "restrict" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "restrict" }),
    year: integer("year").notNull(),
    semester: integer("semester").notNull(),
    admissionDate: date("admission_date").notNull(),
    status: studentStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    studentIdIdx: index("students_student_id_idx").on(table.studentId),
    emailIdx: index("students_email_idx").on(table.email),
    departmentIdIdx: index("students_department_id_idx").on(table.departmentId),
    courseIdIdx: index("students_course_id_idx").on(table.courseId),
    statusIdx: index("students_status_idx").on(table.status)
  })
);

export const studentsRelations = relations(students, ({ one, many }) => ({
  department: one(departments, { fields: [students.departmentId], references: [departments.id] }),
  course: one(courses, { fields: [students.courseId], references: [courses.id] }),
  fees: many(fees)
}));

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
