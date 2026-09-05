import { z } from "zod";

export const announcementCreateSchema = z.object({
  title: z.string().trim().min(2).max(200),
  content: z.string().trim().min(1),
  published: z.boolean().optional()
});

export const announcementUpdateSchema = announcementCreateSchema.partial();

export const announcementQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  published: z.coerce.boolean().optional()
});

export type AnnouncementCreateInput = z.infer<typeof announcementCreateSchema>;
export type AnnouncementUpdateInput = z.infer<typeof announcementUpdateSchema>;
export type AnnouncementQueryInput = z.infer<typeof announcementQuerySchema>;
