import { announcementRepository } from "@/repositories/announcement.repository";
import { NotFoundError } from "@/lib/errors";
import { parsePagination, buildPaginationMeta } from "@/lib/api/pagination";
import type {
  AnnouncementCreateInput,
  AnnouncementUpdateInput,
  AnnouncementQueryInput
} from "@/lib/validations/announcement.validation";

export const announcementService = {
  async list(query: AnnouncementQueryInput, searchParams: URLSearchParams) {
    const { limit, offset, page } = parsePagination(searchParams);
    const { rows, total } = await announcementRepository.findMany(query, limit, offset);
    return { rows, pagination: buildPaginationMeta(page, limit, total) };
  },

  async getById(id: string) {
    const announcement = await announcementRepository.findById(id);
    if (!announcement) throw new NotFoundError("Announcement");
    return announcement;
  },

  async create(input: AnnouncementCreateInput) {
    return announcementRepository.create({
      title: input.title,
      content: input.content,
      published: input.published ?? false
    });
  },

  async update(id: string, input: AnnouncementUpdateInput) {
    await this.getById(id);
    const updated = await announcementRepository.update(id, input);
    if (!updated) throw new NotFoundError("Announcement");
    return updated;
  },

  async delete(id: string) {
    await this.getById(id);
    return announcementRepository.delete(id);
  },

  /** For the public website - published only. */
  async listPublished(limit = 10) {
    return announcementRepository.findRecent(limit);
  }
};
