import { z } from "zod";
import { uuidSchema, dateStringSchema, moneySchema } from "./common";

export const feeStatusValues = ["PENDING", "PARTIAL", "PAID", "OVERDUE"] as const;

export const feeCreateSchema = z.object({
  studentId: uuidSchema,
  academicYear: z.string().trim().min(4).max(20),
  totalAmount: moneySchema,
  dueDate: dateStringSchema
});

export const feeUpdateSchema = z.object({
  academicYear: z.string().trim().min(4).max(20).optional(),
  totalAmount: moneySchema.optional(),
  dueDate: dateStringSchema.optional(),
  status: z.enum(feeStatusValues).optional()
});

export const feeQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  studentId: uuidSchema.optional(),
  status: z.enum(feeStatusValues).optional(),
  academicYear: z.string().trim().optional()
});

export type FeeCreateInput = z.infer<typeof feeCreateSchema>;
export type FeeUpdateInput = z.infer<typeof feeUpdateSchema>;
export type FeeQueryInput = z.infer<typeof feeQuerySchema>;
