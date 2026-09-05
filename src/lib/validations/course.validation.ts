import { z } from "zod";
import { uuidSchema } from "./common";

export const courseCreateSchema = z.object({
  name: z.string().trim().min(2).max(150),
  code: z.string().trim().toUpperCase().min(2).max(20),
  description: z.string().trim().max(2000).optional(),
  durationYears: z.number().int().min(1).max(10),
  departmentId: uuidSchema
});

export const courseUpdateSchema = courseCreateSchema.partial();

export type CourseCreateInput = z.infer<typeof courseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;
