import { departmentRepository } from "@/repositories/department.repository";
import { ConflictError, NotFoundError, BadRequestError } from "@/lib/errors";
import type {
  DepartmentCreateInput,
  DepartmentUpdateInput
} from "@/lib/validations/department.validation";

export const departmentService = {
  async list() {
    return departmentRepository.findAll();
  },

  async getById(id: string) {
    const department = await departmentRepository.findById(id);
    if (!department) throw new NotFoundError("Department");
    return department;
  },

  async create(input: DepartmentCreateInput) {
    const existing = await departmentRepository.findByCode(input.code);
    if (existing) throw new ConflictError(`Department code "${input.code}" is already in use`);
    return departmentRepository.create(input);
  },

  async update(id: string, input: DepartmentUpdateInput) {
    await this.getById(id);

    if (input.code) {
      const existing = await departmentRepository.findByCode(input.code);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Department code "${input.code}" is already in use`);
      }
    }

    const updated = await departmentRepository.update(id, input);
    if (!updated) throw new NotFoundError("Department");
    return updated;
  },

  /** Deletion is blocked whenever dependent courses/faculty/students exist
   * (requirement #14) rather than silently cascading. */
  async delete(id: string) {
    await this.getById(id);
    const dependents = await departmentRepository.countDependents(id);
    const totalDependents = dependents.courses + dependents.faculty + dependents.students;

    if (totalDependents > 0) {
      throw new BadRequestError(
        `Cannot delete department: it has ${dependents.courses} course(s), ${dependents.faculty} faculty member(s), and ${dependents.students} student(s) linked to it. Reassign or remove them first.`
      );
    }

    return departmentRepository.delete(id);
  }
};
