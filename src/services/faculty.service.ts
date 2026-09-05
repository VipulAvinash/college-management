import { facultyRepository } from "@/repositories/faculty.repository";
import { departmentService } from "./department.service";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { parsePagination, buildPaginationMeta } from "@/lib/api/pagination";
import type { FacultyCreateInput, FacultyUpdateInput, FacultyQueryInput } from "@/lib/validations/faculty.validation";

export const facultyService = {
  async list(query: FacultyQueryInput, searchParams: URLSearchParams) {
    const { limit, offset, page } = parsePagination(searchParams);
    const { rows, total } = await facultyRepository.findMany(query, limit, offset);
    return { rows, pagination: buildPaginationMeta(page, limit, total) };
  },

  async getById(id: string) {
    const member = await facultyRepository.findById(id);
    if (!member) throw new NotFoundError("Faculty member");
    return member;
  },

  async create(input: FacultyCreateInput) {
    await departmentService.getById(input.departmentId);

    const [existingByEmployeeId, existingByEmail] = await Promise.all([
      facultyRepository.findByEmployeeId(input.employeeId),
      facultyRepository.findByEmail(input.email)
    ]);
    if (existingByEmployeeId) throw new ConflictError(`Employee ID "${input.employeeId}" is already in use`);
    if (existingByEmail) throw new ConflictError(`Email "${input.email}" is already in use`);

    return facultyRepository.create(input);
  },

  async update(id: string, input: FacultyUpdateInput) {
    await this.getById(id);

    if (input.departmentId) await departmentService.getById(input.departmentId);
    if (input.employeeId) {
      const existing = await facultyRepository.findByEmployeeId(input.employeeId);
      if (existing && existing.id !== id) throw new ConflictError(`Employee ID "${input.employeeId}" is already in use`);
    }
    if (input.email) {
      const existing = await facultyRepository.findByEmail(input.email);
      if (existing && existing.id !== id) throw new ConflictError(`Email "${input.email}" is already in use`);
    }

    const updated = await facultyRepository.update(id, input);
    if (!updated) throw new NotFoundError("Faculty member");
    return updated;
  },

  async delete(id: string) {
    await this.getById(id);
    return facultyRepository.delete(id);
  }
};
