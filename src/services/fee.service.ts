import { feeRepository } from "@/repositories/fee.repository";
import { studentService } from "./student.service";
import { NotFoundError } from "@/lib/errors";
import { parsePagination, buildPaginationMeta } from "@/lib/api/pagination";
import type { FeeCreateInput, FeeUpdateInput, FeeQueryInput } from "@/lib/validations/fee.validation";
import type { Fee } from "@/db/schema";

/** Derives status from amounts + due date (requirement #17). Pure function
 * so both fee.service and payment.service can reuse identical logic. */
export function computeFeeStatus(params: {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
}): "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" {
  const { paidAmount, pendingAmount, dueDate } = params;

  if (pendingAmount <= 0) return "PAID";

  const isPastDue = new Date(dueDate).getTime() < Date.now();
  if (isPastDue) return "OVERDUE";

  if (paidAmount > 0) return "PARTIAL";
  return "PENDING";
}

export const feeService = {
  async list(query: FeeQueryInput, searchParams: URLSearchParams) {
    const { limit, offset, page } = parsePagination(searchParams);
    const { rows, total } = await feeRepository.findMany(query, limit, offset);
    return { rows, pagination: buildPaginationMeta(page, limit, total) };
  },

  async getById(id: string) {
    const fee = await feeRepository.findById(id);
    if (!fee) throw new NotFoundError("Fee record");
    return fee;
  },

  async getByStudent(studentId: string) {
    await studentService.getById(studentId);
    return feeRepository.findByStudent(studentId);
  },

  async create(input: FeeCreateInput) {
    await studentService.getById(input.studentId);

    const pendingAmount = input.totalAmount;
    const status = computeFeeStatus({
      totalAmount: input.totalAmount,
      paidAmount: 0,
      pendingAmount,
      dueDate: input.dueDate
    });

    return feeRepository.create({
      studentId: input.studentId,
      academicYear: input.academicYear,
      totalAmount: input.totalAmount.toFixed(2),
      paidAmount: "0.00",
      pendingAmount: pendingAmount.toFixed(2),
      dueDate: input.dueDate,
      status
    });
  },

  async update(id: string, input: FeeUpdateInput) {
    const existing = await this.getById(id);

    const totalAmount = input.totalAmount ?? Number(existing.totalAmount);
    const paidAmount = Number(existing.paidAmount);
    const pendingAmount = totalAmount - paidAmount;
    const dueDate = input.dueDate ?? existing.dueDate;

    const status =
      input.status ?? computeFeeStatus({ totalAmount, paidAmount, pendingAmount, dueDate });

    const updated = await feeRepository.update(id, {
      ...(input.academicYear ? { academicYear: input.academicYear } : {}),
      totalAmount: totalAmount.toFixed(2),
      pendingAmount: pendingAmount.toFixed(2),
      dueDate,
      status
    });
    if (!updated) throw new NotFoundError("Fee record");
    return updated;
  },

  async dashboardTotals() {
    const [totals, pendingCount, overdueCount, paidCount] = await Promise.all([
      feeRepository.aggregateTotals(),
      feeRepository.countByStatus("PENDING"),
      feeRepository.countByStatus("OVERDUE"),
      feeRepository.countByStatus("PAID")
    ]);

    return {
      totalFees: totals.totalAmount,
      totalPaid: totals.paidAmount,
      totalPending: totals.pendingAmount,
      countPending: pendingCount,
      countOverdue: overdueCount,
      countPaid: paidCount
    };
  }
};
