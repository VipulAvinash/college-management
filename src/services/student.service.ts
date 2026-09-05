import { studentRepository } from "@/repositories/student.repository";
import { departmentService } from "./department.service";
import { courseService } from "./course.service";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { parsePagination, buildPaginationMeta } from "@/lib/api/pagination";
import type { StudentCreateInput, StudentUpdateInput, StudentQueryInput } from "@/lib/validations/student.validation";

export const studentService = {
  async list(query: StudentQueryInput, searchParams: URLSearchParams) {
    const { limit, offset, page } = parsePagination(searchParams);
    const { rows, total } = await studentRepository.findMany(query, limit, offset);
    return { rows, pagination: buildPaginationMeta(page, limit, total) };
  },

  async getById(id: string) {
    const student = await studentRepository.findById(id);
    if (!student) throw new NotFoundError("Student");
    return student;
  },

  async create(input: StudentCreateInput) {
    await departmentService.getById(input.departmentId);
    const course = await courseService.getById(input.courseId);
    if (course.departmentId !== input.departmentId) {
      throw new ConflictError("Selected course does not belong to the selected department");
    }

    const [existingByStudentId, existingByEmail] = await Promise.all([
      studentRepository.findByStudentId(input.studentId),
      studentRepository.findByEmail(input.email)
    ]);
    if (existingByStudentId) throw new ConflictError(`Student ID "${input.studentId}" is already in use`);
    if (existingByEmail) throw new ConflictError(`Email "${input.email}" is already in use`);

    return studentRepository.create(input);
  },

  async update(id: string, input: StudentUpdateInput) {
    await this.getById(id);

    if (input.departmentId) await departmentService.getById(input.departmentId);
    if (input.courseId) await courseService.getById(input.courseId);

    if (input.studentId) {
      const existing = await studentRepository.findByStudentId(input.studentId);
      if (existing && existing.id !== id) throw new ConflictError(`Student ID "${input.studentId}" is already in use`);
    }
    if (input.email) {
      const existing = await studentRepository.findByEmail(input.email);
      if (existing && existing.id !== id) throw new ConflictError(`Email "${input.email}" is already in use`);
    }

    const updated = await studentRepository.update(id, input);
    if (!updated) throw new NotFoundError("Student");
    return updated;
  },

  /** Soft option: set status to INACTIVE rather than hard-deleting when
   * fee history exists is left to the admin's judgement; here we hard-delete
   * on explicit DELETE, relying on FK cascade for the student's fee history. */
  async delete(id: string) {
    await this.getById(id);
    return studentRepository.delete(id);
  }
};
