import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { hashPassword } from "../lib/auth/password";
import * as schema from "./schema";

/**
 * Development seed data. Re-runnable: uses upsert-style existence checks
 * so running it twice doesn't create duplicates or blow up on unique
 * constraints. DO NOT run against a production database with real data.
 */
async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(client, { schema });

  console.log("Seeding admin user...");
  const adminEmail = "admin@college.com";
  const existingAdmin = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, adminEmail)
  });
  if (!existingAdmin) {
    const passwordHash = await hashPassword("Admin@123");
    await db.insert(schema.users).values({
      name: "System Administrator",
      email: adminEmail,
      passwordHash,
      role: "ADMIN"
    });
    console.log("  Created admin:", adminEmail, "(password: Admin@123 - CHANGE IN PRODUCTION)");
  } else {
    console.log("  Admin already exists, skipping.");
  }

  console.log("Seeding departments...");
  const departmentSeeds = [
    { name: "Computer Science", code: "CSE", description: "Computer Science and Engineering" },
    { name: "Information Technology", code: "IT", description: "Information Technology" },
    { name: "Electronics", code: "ECE", description: "Electronics and Communication Engineering" },
    { name: "Mechanical Engineering", code: "MECH", description: "Mechanical Engineering" },
    { name: "Civil Engineering", code: "CIVIL", description: "Civil Engineering" }
  ];

  const departments: schema.Department[] = [];
  for (const dept of departmentSeeds) {
    let existing = await db.query.departments.findFirst({
      where: (d, { eq }) => eq(d.code, dept.code)
    });
    if (!existing) {
      const [created] = await db.insert(schema.departments).values(dept).returning();
      if (created) existing = created;
      console.log("  Created department:", dept.code);
    }
    if (existing) departments.push(existing);
  }

  const byCode = (code: string) => {
    const d = departments.find((dept) => dept.code === code);
    if (!d) throw new Error(`Department ${code} missing`);
    return d;
  };

  console.log("Seeding courses...");
  const courseSeeds = [
    { name: "B.Tech Computer Science", code: "BTCSE", durationYears: 4, departmentId: byCode("CSE").id },
    { name: "M.Tech Computer Science", code: "MTCSE", durationYears: 2, departmentId: byCode("CSE").id },
    { name: "B.Tech Information Technology", code: "BTIT", durationYears: 4, departmentId: byCode("IT").id },
    { name: "B.Tech Electronics", code: "BTECE", durationYears: 4, departmentId: byCode("ECE").id },
    { name: "B.Tech Mechanical", code: "BTMECH", durationYears: 4, departmentId: byCode("MECH").id },
    { name: "B.Tech Civil", code: "BTCIVIL", durationYears: 4, departmentId: byCode("CIVIL").id }
  ];

  const courses: schema.Course[] = [];
  for (const c of courseSeeds) {
    let existing = await db.query.courses.findFirst({ where: (row, { eq }) => eq(row.code, c.code) });
    if (!existing) {
      const [created] = await db.insert(schema.courses).values(c).returning();
      if (!created) continue;
      existing = created;
      console.log("  Created course:", c.code);
    }
    if (existing) courses.push(existing);
  }

  const courseByCode = (code: string) => {
    const c = courses.find((crs) => crs.code === code);
    if (!c) throw new Error(`Course ${code} missing`);
    return c;
  };

  console.log("Seeding students...");
  const studentSeeds = [
    { first: "Aarav", last: "Sharma", course: "BTCSE", dept: "CSE" },
    { first: "Vivaan", last: "Reddy", course: "BTCSE", dept: "CSE" },
    { first: "Isha", last: "Patel", course: "BTIT", dept: "IT" },
    { first: "Ananya", last: "Iyer", course: "BTIT", dept: "IT" },
    { first: "Rohan", last: "Nair", course: "BTECE", dept: "ECE" },
    { first: "Diya", last: "Menon", course: "BTECE", dept: "ECE" },
    { first: "Kabir", last: "Gupta", course: "BTMECH", dept: "MECH" },
    { first: "Saanvi", last: "Rao", course: "BTMECH", dept: "MECH" },
    { first: "Arjun", last: "Verma", course: "BTCIVIL", dept: "CIVIL" },
    { first: "Myra", last: "Joshi", course: "BTCIVIL", dept: "CIVIL" }
  ];

  const students: schema.Student[] = [];
  for (let i = 0; i < studentSeeds.length; i++) {
    const s = studentSeeds[i];
    if (!s) continue;
    const studentId = `STU2026${String(i + 1).padStart(3, "0")}`;
    let existing = await db.query.students.findFirst({
      where: (row, { eq }) => eq(row.studentId, studentId)
    });
    if (!existing) {
      const [created] = await db
        .insert(schema.students)
        .values({
          studentId,
          firstName: s.first,
          lastName: s.last,
          email: `${s.first.toLowerCase()}.${s.last.toLowerCase()}@student.college.com`,
          phone: `98765${String(10000 + i).slice(-5)}`,
          dateOfBirth: "2005-06-15",
          gender: i % 2 === 0 ? "MALE" : "FEMALE",
          address: "123 College Road",
          departmentId: byCode(s.dept).id,
          courseId: courseByCode(s.course).id,
          year: 2,
          semester: 3,
          admissionDate: "2024-07-01",
          status: "ACTIVE"
        })
        .returning();
      if (created) existing = created;
      console.log("  Created student:", studentId);
    }
    if (existing) students.push(existing);
  }

  console.log("Seeding faculty...");
  const facultySeeds = [
    { first: "Dr. Rajesh", last: "Kumar", dept: "CSE", designation: "Professor" },
    { first: "Dr. Priya", last: "Singh", dept: "IT", designation: "Associate Professor" },
    { first: "Dr. Suresh", last: "Babu", dept: "ECE", designation: "Assistant Professor" },
    { first: "Dr. Lakshmi", last: "Narayan", dept: "MECH", designation: "Professor" },
    { first: "Dr. Anil", last: "Deshmukh", dept: "CIVIL", designation: "Associate Professor" }
  ];

  for (let i = 0; i < facultySeeds.length; i++) {
    const f = facultySeeds[i];
    if (!f) continue;
    const employeeId = `EMP2026${String(i + 1).padStart(3, "0")}`;
    const existing = await db.query.faculty.findFirst({
      where: (row, { eq }) => eq(row.employeeId, employeeId)
    });
    if (!existing) {
      await db.insert(schema.faculty).values({
        employeeId,
        firstName: f.first,
        lastName: f.last,
        email: `${f.first.replace("Dr. ", "").toLowerCase()}.${f.last.toLowerCase()}@college.com`,
        phone: `91234${String(10000 + i).slice(-5)}`,
        departmentId: byCode(f.dept).id,
        designation: f.designation,
        joiningDate: "2015-08-01",
        status: "ACTIVE"
      });
      console.log("  Created faculty:", employeeId);
    }
  }

  console.log("Seeding fees...");
  const fees: schema.Fee[] = [];
  for (const student of students) {
    const existing = await db.query.fees.findFirst({
      where: (row, { and, eq }) => and(eq(row.studentId, student.id), eq(row.academicYear, "2025-26"))
    });
    if (!existing) {
      const totalAmount = "120000.00";
      const [created] = await db
        .insert(schema.fees)
        .values({
          studentId: student.id,
          academicYear: "2025-26",
          totalAmount,
          paidAmount: "0.00",
          pendingAmount: totalAmount,
          dueDate: "2026-03-31",
          status: "PENDING"
        })
        .returning();
      if (created) fees.push(created);
      console.log("  Created fee record for", student.studentId);
    } else {
      fees.push(existing);
    }
  }

  console.log("Seeding sample payments...");
  for (let i = 0; i < Math.min(4, fees.length); i++) {
    const fee = fees[i];
    if (!fee || Number(fee.paidAmount) > 0) continue;

    const paymentAmount = 50000;
    const [payment] = await db
      .insert(schema.feePayments)
      .values({
        feeId: fee.id,
        studentId: fee.studentId,
        amount: paymentAmount.toFixed(2),
        paymentDate: "2025-08-15",
        paymentMethod: i % 2 === 0 ? "BANK_TRANSFER" : "UPI",
        transactionReference: `TXN2025${String(i + 1).padStart(4, "0")}`,
        remarks: "Initial installment"
      })
      .returning();

    if (!payment) continue;

    const newPaid = Number(fee.paidAmount) + paymentAmount;
    const newPending = Number(fee.totalAmount) - newPaid;
    await db
      .update(schema.fees)
      .set({
        paidAmount: newPaid.toFixed(2),
        pendingAmount: newPending.toFixed(2),
        status: newPending > 0 ? "PARTIAL" : "PAID",
        updatedAt: new Date()
      })
      .where(eq(schema.fees.id, fee.id));

    console.log("  Recorded payment", payment.transactionReference);
  }

  console.log("Seeding announcements...");
  const announcementSeeds = [
    { title: "Welcome to New Academic Year 2025-26", content: "Classes begin on August 1st. Please check your timetables.", published: true },
    { title: "Fee Payment Deadline", content: "All pending fees for 2025-26 must be cleared by March 31, 2026.", published: true },
    { title: "Annual Sports Meet", content: "The annual sports meet will be held next month. Registrations open now.", published: true },
    { title: "Library Renovation Notice", content: "The central library will be closed for renovation from next week.", published: false }
  ];

  for (const a of announcementSeeds) {
    const existing = await db.query.announcements.findFirst({
      where: (row, { eq }) => eq(row.title, a.title)
    });
    if (!existing) {
      await db.insert(schema.announcements).values(a);
      console.log("  Created announcement:", a.title);
    }
  }

  console.log("\nSeed complete.");
  console.log("Admin login -> email: admin@college.com | password: Admin@123 (development only, change in production)");

  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
