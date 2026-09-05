import {
  pgTable,
  uuid,
  varchar,
  numeric,
  date,
  timestamp,
  index,
  check
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { feeStatusEnum } from "./enums";
import { students } from "./students";
import { feePayments } from "./payments";

export const fees = pgTable(
  "fees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    academicYear: varchar("academic_year", { length: 20 }).notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    pendingAmount: numeric("pending_amount", { precision: 12, scale: 2 }).notNull(),
    dueDate: date("due_date").notNull(),
    status: feeStatusEnum("status").notNull().default("PENDING"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    studentIdIdx: index("fees_student_id_idx").on(table.studentId),
    statusIdx: index("fees_status_idx").on(table.status),
    academicYearIdx: index("fees_academic_year_idx").on(table.academicYear),
    totalAmountNonNegative: check("fees_total_amount_check", sql`${table.totalAmount} >= 0`),
    paidAmountNonNegative: check("fees_paid_amount_check", sql`${table.paidAmount} >= 0`),
    pendingAmountNonNegative: check("fees_pending_amount_check", sql`${table.pendingAmount} >= 0`)
  })
);

export const feesRelations = relations(fees, ({ one, many }) => ({
  student: one(students, { fields: [fees.studentId], references: [students.id] }),
  payments: many(feePayments)
}));

export type Fee = typeof fees.$inferSelect;
export type NewFee = typeof fees.$inferInsert;
