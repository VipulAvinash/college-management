import {
  pgTable,
  uuid,
  varchar,
  numeric,
  date,
  text,
  timestamp,
  index,
  uniqueIndex,
  check
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { paymentMethodEnum } from "./enums";
import { students } from "./students";
import { fees } from "./fees";

export const feePayments = pgTable(
  "fee_payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    feeId: uuid("fee_id")
      .notNull()
      .references(() => fees.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    paymentDate: date("payment_date").notNull(),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    transactionReference: varchar("transaction_reference", { length: 100 }),
    remarks: text("remarks"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    studentIdIdx: index("fee_payments_student_id_idx").on(table.studentId),
    feeIdIdx: index("fee_payments_fee_id_idx").on(table.feeId),
    paymentDateIdx: index("fee_payments_payment_date_idx").on(table.paymentDate),
    transactionReferenceIdx: index("fee_payments_transaction_reference_idx").on(
      table.transactionReference
    ),
    // Partial unique index: prevents recording the same bank/UPI transaction
    // reference twice, while allowing multiple NULLs (cash payments, etc.)
    transactionReferenceUniqueIdx: uniqueIndex(
      "fee_payments_transaction_reference_unique_idx"
    )
      .on(table.transactionReference)
      .where(sql`${table.transactionReference} IS NOT NULL`),
    amountPositive: check("fee_payments_amount_check", sql`${table.amount} > 0`)
  })
);

export const feePaymentsRelations = relations(feePayments, ({ one }) => ({
  fee: one(fees, { fields: [feePayments.feeId], references: [fees.id] }),
  student: one(students, { fields: [feePayments.studentId], references: [students.id] })
}));

export type FeePayment = typeof feePayments.$inferSelect;
export type NewFeePayment = typeof feePayments.$inferInsert;
