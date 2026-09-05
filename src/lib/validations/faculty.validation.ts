import { z } from "zod";
import { emailSchema, phoneSchema, dateStringSchema, uuidSchema } from "./common";

export const facultyStatusValues = ["ACTIVE", "INACTIVE", "ON_LEAVE"] as const;

export const facultyCreateSchema = z.object({
  employeeId: z.string().trim().min(2).max(30),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: emailSchema,
  phone: phoneSchema,
  departmentId: uuidSchema,
  designation: z.string().trim().min(2).max(100),
  joiningDate: dateStringSchema,
  status: z.enum(facultyStatusValues).optional()
});

export const facultyUpdateSchema = facultyCreateSchema.partial();

export const facultyQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().max(200).optional(),
  departmentId: uuidSchema.optional(),
  status: z.enum(facultyStatusValues).optional()
});

export type FacultyCreateInput = z.infer<typeof facultyCreateSchema>;
export type FacultyUpdateInput = z.infer<typeof facultyUpdateSchema>;
export type FacultyQueryInput = z.infer<typeof facultyQuerySchema>;
