import { z } from "zod";

export const uuidSchema = z.string().uuid("Must be a valid UUID");

export const emailSchema = z.string().trim().toLowerCase().email("Invalid email address");

// Loose but sane E.164-ish check; adjust to your locale's format if needed.
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number");

export const dateStringSchema = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date");

export const moneySchema = z
  .number()
  .nonnegative("Amount must not be negative")
  .finite();

export const positiveMoneySchema = z
  .number()
  .positive("Amount must be greater than zero")
  .finite();

export function paginationQuerySchema() {
  return z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional()
  });
}
