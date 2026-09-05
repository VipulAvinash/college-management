import { z } from "zod";
import { emailSchema, phoneSchema, dateStringSchema, uuidSchema } from "./common";

export const studentStatusValues = ["ACTIVE", "INACTIVE", "GRADUATED", "SUSPENDED"] as const;
export const genderValues = ["MALE", "FEMALE", "OTHER"] as const;

export const studentCreateSchema = z.object({
  studentId: z.string().trim().min(2).max(30),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: emailSchema,
  phone: phoneSchema,
  dateOfBirth: dateStringSchema,
  gender: z.enum(genderValues),
  address: z.string().trim().max(500).optional(),
  departmentId: uuidSchema,
  courseId: uuidSchema,
  year: z.number().int().min(1).max(10),
  semester: z.number().int().min(1).max(20),
  admissionDate: dateStringSchema,
  status: z.enum(studentStatusValues).optional()
});

export const studentUpdateSchema = studentCreateSchema.partial();

export const studentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().max(200).optional(),
  departmentId: uuidSchema.optional(),
  courseId: uuidSchema.optional(),
  year: z.coerce.number().int().optional(),
  semester: z.coerce.number().int().optional(),
  status: z.enum(studentStatusValues).optional()
});

export type StudentCreateInput = z.infer<typeof studentCreateSchema>;
export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>;
export type StudentQueryInput = z.infer<typeof studentQuerySchema>;
