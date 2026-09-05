import { courseRepository } from "@/repositories/course.repository";
import { departmentService } from "./department.service";
import { ConflictError, NotFoundError, BadRequestError } from "@/lib/errors";
import type { CourseCreateInput, CourseUpdateInput } from "@/lib/validations/course.validation";

export const courseService = {
  async list(departmentId?: string) {
    return courseRepository.findAll(departmentId);
  },

  async getById(id: string) {
    const course = await courseRepository.findById(id);
    if (!course) throw new NotFoundError("Course");
    return course;
  },

  async create(input: CourseCreateInput) {
    await departmentService.getById(input.departmentId); // validates FK exists
    const existing = await courseRepository.findByCode(input.code);
    if (existing) throw new ConflictError(`Course code "${input.code}" is already in use`);
    return courseRepository.create(input);
  },

  async update(id: string, input: CourseUpdateInput) {
    await this.getById(id);

    if (input.departmentId) {
      await departmentService.getById(input.departmentId);
    }
    if (input.code) {
      const existing = await courseRepository.findByCode(input.code);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Course code "${input.code}" is already in use`);
      }
    }

    const updated = await courseRepository.update(id, input);
    if (!updated) throw new NotFoundError("Course");
    return updated;
  },

  async delete(id: string) {
    await this.getById(id);
    const studentCount = await courseRepository.countDependentStudents(id);
    if (studentCount > 0) {
      throw new BadRequestError(
        `Cannot delete course: ${studentCount} student(s) are enrolled in it.`
      );
    }
    return courseRepository.delete(id);
  }
};
