import { z } from "zod";

export const departmentCreateSchema = z.object({
  name: z.string().trim().min(2).max(150),
  code: z.string().trim().toUpperCase().min(2).max(20),
  description: z.string().trim().max(2000).optional()
});

export const departmentUpdateSchema = departmentCreateSchema.partial();

export type DepartmentCreateInput = z.infer<typeof departmentCreateSchema>;
export type DepartmentUpdateInput = z.infer<typeof departmentUpdateSchema>;
