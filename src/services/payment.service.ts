import { db } from "@/db";
import { fees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { paymentRepository } from "@/repositories/payment.repository";
import { feeService, computeFeeStatus } from "./fee.service";
import { studentService } from "./student.service";
import { ConflictError, NotFoundError, BadRequestError } from "@/lib/errors";
import { parsePagination, buildPaginationMeta } from "@/lib/api/pagination";
import type { PaymentCreateInput, PaymentQueryInput } from "@/lib/validations/payment.validation";

export const paymentService = {
  async list(query: PaymentQueryInput, searchParams: URLSearchParams) {
    const { limit, offset, page } = parsePagination(searchParams);
    const { rows, total } = await paymentRepository.findMany(query, limit, offset);
    return { rows, pagination: buildPaginationMeta(page, limit, total) };
  },

  async getById(id: string) {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new NotFoundError("Payment");
    return payment;
  },

  /**
   * Records a payment against a fee and updates the fee's paid/pending
   * amounts + status atomically (requirement #17). Everything here runs
   * inside a single DB transaction so a payment can never be recorded
   * without the fee balance being updated to match, or vice versa.
   */
  async recordPayment(input: PaymentCreateInput) {
    const student = await studentService.getById(input.studentId);
    const fee = await feeService.getById(input.feeId);

    if (fee.studentId !== student.id) {
      throw new BadRequestError("The selected fee record does not belong to the selected student");
    }

    if (input.transactionReference) {
      const existingRef = await paymentRepository.findByTransactionReference(
        input.transactionReference
      );
      if (existingRef) {
        throw new ConflictError(
          `Transaction reference "${input.transactionReference}" has already been recorded`
        );
      }
    }

    const currentPending = Number(fee.pendingAmount);
    if (input.amount > currentPending) {
      throw new BadRequestError(
        `Payment amount (${input.amount}) exceeds the remaining balance (${currentPending})`
      );
    }

    return db.transaction(async (tx) => {
      const payment = await paymentRepository.createWithClient(tx, {
        feeId: input.feeId,
        studentId: input.studentId,
        amount: input.amount.toFixed(2),
        paymentDate: input.paymentDate,
        paymentMethod: input.paymentMethod,
        transactionReference: input.transactionReference,
        remarks: input.remarks
      });

      const newPaidAmount = Number(fee.paidAmount) + input.amount;
      const newPendingAmount = Number(fee.totalAmount) - newPaidAmount;
      const newStatus = computeFeeStatus({
        totalAmount: Number(fee.totalAmount),
        paidAmount: newPaidAmount,
        pendingAmount: newPendingAmount,
        dueDate: fee.dueDate
      });

      const [updatedFee] = await tx
        .update(fees)
        .set({
          paidAmount: newPaidAmount.toFixed(2),
          pendingAmount: newPendingAmount.toFixed(2),
          status: newStatus,
          updatedAt: new Date()
        })
        .where(eq(fees.id, fee.id))
        .returning();

      return { payment, fee: updatedFee };
    });
  }
};
