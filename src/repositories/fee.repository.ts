import { and, count, eq, sum, SQL } from "drizzle-orm";
import { db } from "@/db";
import { fees, type NewFee } from "@/db/schema";
import type { FeeQueryInput } from "@/lib/validations/fee.validation";

function buildFilters(query: Omit<FeeQueryInput, "page" | "limit">) {
  const conditions: SQL[] = [];
  if (query.studentId) conditions.push(eq(fees.studentId, query.studentId));
  if (query.status) conditions.push(eq(fees.status, query.status));
  if (query.academicYear) conditions.push(eq(fees.academicYear, query.academicYear));
  return conditions.length ? and(...conditions) : undefined;
}

export const feeRepository = {
  async findMany(query: FeeQueryInput, limit: number, offset: number) {
    const where = buildFilters(query);
    const [rows, countRes] = await Promise.all([
      db.select().from(fees).where(where).orderBy(fees.dueDate).limit(limit).offset(offset),
      db.select({ value: count() }).from(fees).where(where)
    ]);
    const total = countRes[0]?.value ?? 0;
    return { rows, total };
  },

  async findById(id: string) {
    const [row] = await db.select().from(fees).where(eq(fees.id, id)).limit(1);
    return row ?? null;
  },

  async findByStudent(studentId: string) {
    return db.select().from(fees).where(eq(fees.studentId, studentId)).orderBy(fees.dueDate);
  },

  async create(data: NewFee) {
    const [row] = await db.insert(fees).values(data).returning();
    return row;
  },

  async update(id: string, data: Partial<NewFee>) {
    const [row] = await db
      .update(fees)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(fees.id, id))
      .returning();
    return row ?? null;
  },

  /** Aggregated totals for the dashboard - computed in SQL, not in JS. */
  async aggregateTotals() {
    const [row] = await db
      .select({
        totalAmount: sum(fees.totalAmount),
        paidAmount: sum(fees.paidAmount),
        pendingAmount: sum(fees.pendingAmount)
      })
      .from(fees);

    return {
      totalAmount: Number(row?.totalAmount ?? 0),
      paidAmount: Number(row?.paidAmount ?? 0),
      pendingAmount: Number(row?.pendingAmount ?? 0)
    };
  },

  async countByStatus(status: (typeof fees.status.enumValues)[number]) {
    const [row] = await db.select({ value: count() }).from(fees).where(eq(fees.status, status));
    return row?.value ?? 0;
  }
};
