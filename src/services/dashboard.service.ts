import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { students, faculty, departments, courses } from "@/db/schema";
import { feeService } from "./fee.service";
import { studentRepository } from "@/repositories/student.repository";
import { paymentRepository } from "@/repositories/payment.repository";
import { announcementRepository } from "@/repositories/announcement.repository";

async function countStudents() {
  const [row] = await db.select({ value: count() }).from(students);
  return row?.value ?? 0;
}
async function countFaculty() {
  const [row] = await db.select({ value: count() }).from(faculty);
  return row?.value ?? 0;
}
async function countDepartments() {
  const [row] = await db.select({ value: count() }).from(departments);
  return row?.value ?? 0;
}
async function countCourses() {
  const [row] = await db.select({ value: count() }).from(courses);
  return row?.value ?? 0;
}

/**
 * All counts/aggregates are computed with SQL COUNT/SUM rather than
 * fetching full tables into JS (requirement #21).
 */
export const dashboardService = {
  async getStats() {
    const [
      totalStudents,
      activeStudents,
      totalFaculty,
      activeFaculty,
      totalDepartments,
      totalCourses,
      feeTotals,
      recentStudents,
      recentPayments,
      recentAnnouncements
    ] = await Promise.all([
      countStudents(),
      db
        .select({ value: count() })
        .from(students)
        .where(eq(students.status, "ACTIVE"))
        .then((r) => r[0]?.value ?? 0),
      countFaculty(),
      db
        .select({ value: count() })
        .from(faculty)
        .where(eq(faculty.status, "ACTIVE"))
        .then((r) => r[0]?.value ?? 0),
      countDepartments(),
      countCourses(),
      feeService.dashboardTotals(),
      studentRepository.countRecent(5),
      paymentRepository.findRecent(5),
      announcementRepository.findRecent(5)
    ]);

    return {
      students: { total: totalStudents, active: activeStudents },
      faculty: { total: totalFaculty, active: activeFaculty },
      departments: { total: totalDepartments },
      courses: { total: totalCourses },
      fees: {
        total: feeTotals.totalFees,
        paid: feeTotals.totalPaid,
        pending: feeTotals.totalPending,
        pendingCount: feeTotals.countPending,
        overdueCount: feeTotals.countOverdue,
        paidCount: feeTotals.countPaid
      },
      recent: {
        students: recentStudents,
        payments: recentPayments,
        announcements: recentAnnouncements
      }
    };
  }
};
