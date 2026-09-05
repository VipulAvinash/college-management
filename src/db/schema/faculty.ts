import { pgTable, uuid, varchar, date, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { facultyStatusEnum } from "./enums";
import { departments } from "./departments";

// Faculty are DATA ONLY - no password/auth fields (see requirement #2).
export const faculty = pgTable(
  "faculty",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: varchar("employee_id", { length: 30 }).notNull().unique(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }).notNull(),
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "restrict" }),
    designation: varchar("designation", { length: 100 }).notNull(),
    joiningDate: date("joining_date").notNull(),
    status: facultyStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    employeeIdIdx: index("faculty_employee_id_idx").on(table.employeeId),
    emailIdx: index("faculty_email_idx").on(table.email),
    departmentIdIdx: index("faculty_department_id_idx").on(table.departmentId),
    statusIdx: index("faculty_status_idx").on(table.status)
  })
);

export const facultyRelations = relations(faculty, ({ one }) => ({
  department: one(departments, { fields: [faculty.departmentId], references: [departments.id] })
}));

export type Faculty = typeof faculty.$inferSelect;
export type NewFaculty = typeof faculty.$inferInsert;
