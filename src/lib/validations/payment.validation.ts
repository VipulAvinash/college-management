import { z } from "zod";
import { uuidSchema, dateStringSchema, positiveMoneySchema } from "./common";

export const paymentMethodValues = ["CASH", "BANK_TRANSFER", "UPI", "CARD", "OTHER"] as const;

export const paymentCreateSchema = z.object({
  feeId: uuidSchema,
  studentId: uuidSchema,
  amount: positiveMoneySchema,
  paymentDate: dateStringSchema,
  paymentMethod: z.enum(paymentMethodValues),
  transactionReference: z.string().trim().max(100).optional(),
  remarks: z.string().trim().max(500).optional()
});

export const paymentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  studentId: uuidSchema.optional(),
  feeId: uuidSchema.optional(),
  paymentMethod: z.enum(paymentMethodValues).optional(),
  dateFrom: dateStringSchema.optional(),
  dateTo: dateStringSchema.optional()
});

export type PaymentCreateInput = z.infer<typeof paymentCreateSchema>;
export type PaymentQueryInput = z.infer<typeof paymentQuerySchema>;
