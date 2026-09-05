import { and, count, eq, gte, lte, SQL } from "drizzle-orm";
import { db } from "@/db";
import { feePayments, type NewFeePayment } from "@/db/schema";
import type { PaymentQueryInput } from "@/lib/validations/payment.validation";

function buildFilters(query: Omit<PaymentQueryInput, "page" | "limit">) {
  const conditions: SQL[] = [];
  if (query.studentId) conditions.push(eq(feePayments.studentId, query.studentId));
  if (query.feeId) conditions.push(eq(feePayments.feeId, query.feeId));
  if (query.paymentMethod) conditions.push(eq(feePayments.paymentMethod, query.paymentMethod));
  if (query.dateFrom) conditions.push(gte(feePayments.paymentDate, query.dateFrom));
  if (query.dateTo) conditions.push(lte(feePayments.paymentDate, query.dateTo));
  return conditions.length ? and(...conditions) : undefined;
}

export const paymentRepository = {
  async findMany(query: PaymentQueryInput, limit: number, offset: number) {
    const where = buildFilters(query);
    const [rows, countRes] = await Promise.all([
      db
        .select()
        .from(feePayments)
        .where(where)
        .orderBy(feePayments.paymentDate)
        .limit(limit)
        .offset(offset),
      db.select({ value: count() }).from(feePayments).where(where)
    ]);
    const total = countRes[0]?.value ?? 0;
    return { rows, total };
  },

  async findById(id: string) {
    const [row] = await db.select().from(feePayments).where(eq(feePayments.id, id)).limit(1);
    return row ?? null;
  },

  async findByTransactionReference(reference: string) {
    const [row] = await db
      .select()
      .from(feePayments)
      .where(eq(feePayments.transactionReference, reference))
      .limit(1);
    return row ?? null;
  },

  /** Insert is done via the transaction in fee.service.ts, not here directly,
   * but this is exposed for that transaction to use with a scoped `tx` client. */
  async createWithClient(tx: typeof db, data: NewFeePayment) {
    const [row] = await tx.insert(feePayments).values(data).returning();
    return row;
  },

  async findRecent(limit = 5) {
    return db.select().from(feePayments).orderBy(feePayments.paymentDate).limit(limit);
  }
};
