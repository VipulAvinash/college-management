import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { hashPassword } from "../lib/auth/password";
import * as schema from "./schema";

/**
 * Chocolate Kids Play School - Development Seed Data
 */
async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(client, { schema });

  console.log("Seeding admin user...");
  const adminEmail = "admin@college.com"; // Maintain account compatibility with existing login session
  const existingAdmin = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, adminEmail)
  });
  if (!existingAdmin) {
    const passwordHash = await hashPassword("Admin@123");
    await db.insert(schema.users).values({
      name: "Chocolate Kids Administrator",
      email: adminEmail,
      passwordHash,
      role: "ADMIN"
    });
    console.log("  Created admin:", adminEmail, "(password: Admin@123)");
  } else {
    console.log("  Admin already exists, skipping.");
  }

  console.log("Seeding Play Programs (Departments)...");
  const departmentSeeds = [
    { name: "Playgroup Explorers", code: "PG", description: "Age 1.5 to 2.5 Years - Sensory discovery & motor play" },
    { name: "Nursery Learners", code: "NUR", description: "Age 2.5 to 3.5 Years - Phonics awareness & rhymes" },
    { name: "Junior KG Innovators", code: "JKG", description: "Age 3.5 to 4.5 Years - Early math & creative arts" },
    { name: "Senior KG Scholars", code: "SKG", description: "Age 4.5 to 5.5 Years - Primary school readiness" },
    { name: "Day Care & After-School", code: "DC", description: "Age 1 to 8 Years - Supervised care & nutritious meals" }
  ];

  const departments: schema.Department[] = [];
  for (const dept of departmentSeeds) {
    let existing = await db.query.departments.findFirst({
      where: (d, { eq }) => eq(d.code, dept.code)
    });
    if (!existing) {
      const [created] = await db.insert(schema.departments).values(dept).returning();
      if (created) existing = created;
      console.log("  Created program:", dept.code);
    }
    if (existing) departments.push(existing);
  }

  const byCode = (code: string) => {
    const d = departments.find((dept) => dept.code === code);
    if (!d) throw new Error(`Program ${code} missing`);
    return d;
  };

  console.log("Seeding Activity Learning Modules (Courses)...");
  const courseSeeds = [
    { name: "Sensory & Motor Skill Lab", code: "MOD-SENS", durationYears: 1, departmentId: byCode("PG").id },
    { name: "Rhymes & Phonics Awareness", code: "MOD-RHYM", durationYears: 1, departmentId: byCode("NUR").id },
    { name: "Fun with Colors & Clay Arts", code: "MOD-ARTS", durationYears: 1, departmentId: byCode("JKG").id },
    { name: "Toddler Storytelling & Puppet Theatre", code: "MOD-STORY", durationYears: 1, departmentId: byCode("SKG").id },
    { name: "Rhythm, Music & Dance Playground", code: "MOD-MUSIC", durationYears: 1, departmentId: byCode("DC").id }
  ];

  const courses: schema.Course[] = [];
  for (const c of courseSeeds) {
    let existing = await db.query.courses.findFirst({ where: (row, { eq }) => eq(row.code, c.code) });
    if (!existing) {
      const [created] = await db.insert(schema.courses).values(c).returning();
      if (!created) continue;
      existing = created;
      console.log("  Created module:", c.code);
    }
    if (existing) courses.push(existing);
  }

  const courseByCode = (code: string) => {
    const c = courses.find((crs) => crs.code === code);
    if (!c) throw new Error(`Module ${code} missing`);
    return c;
  };

  console.log("Seeding Toddlers & Kids (Students)...");
  const studentSeeds = [
    { first: "Aarav", last: "Sharma", course: "MOD-SENS", dept: "PG" },
    { first: "Vivaan", last: "Reddy", course: "MOD-RHYM", dept: "NUR" },
    { first: "Ananya", last: "Patel", course: "MOD-ARTS", dept: "JKG" },
    { first: "Myra", last: "Kapoor", course: "MOD-STORY", dept: "SKG" },
    { first: "Kabir", last: "Verma", course: "MOD-MUSIC", dept: "DC" }
  ];

  const students: schema.Student[] = [];
  for (let i = 0; i < studentSeeds.length; i++) {
    const s = studentSeeds[i];
    if (!s) continue;
    const studentId = `KID2026${String(i + 1).padStart(3, "0")}`;
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
          email: `parent.${s.first.toLowerCase()}@chocolatekids.edu`,
          phone: `98765${String(10000 + i).slice(-5)}`,
          dateOfBirth: "2022-04-12",
          gender: i % 2 === 0 ? "MALE" : "FEMALE",
          address: "74 Sunshine Avenue, Playtown",
          departmentId: byCode(s.dept).id,
          courseId: courseByCode(s.course).id,
          year: 1,
          semester: 1,
          admissionDate: "2025-06-01",
          status: "ACTIVE"
        })
        .returning();
      if (created) existing = created;
      console.log("  Created toddler record:", studentId);
    }
    if (existing) students.push(existing);
  }

  console.log("Seeding Educators & Staff (Faculty)...");
  const facultySeeds = [
    { first: "Ms. Sarah", last: "Jenkins", dept: "PG", designation: "Playgroup Lead Teacher" },
    { first: "Ms. Priya", last: "Sharma", dept: "NUR", designation: "Montessori Phonics Specialist" },
    { first: "Ms. Emily", last: "Watson", dept: "JKG", designation: "Early Arts & Math Coach" },
    { first: "Ms. Rachel", last: "Green", dept: "SKG", designation: "Kindergarten Prep Lead" },
    { first: "Ms. Maya", last: "Lin", dept: "DC", designation: "Child Care Coordinator" }
  ];

  for (let i = 0; i < facultySeeds.length; i++) {
    const f = facultySeeds[i];
    if (!f) continue;
    const employeeId = `EDU2026${String(i + 1).padStart(3, "0")}`;
    const existing = await db.query.faculty.findFirst({
      where: (row, { eq }) => eq(row.employeeId, employeeId)
    });
    if (!existing) {
      await db.insert(schema.faculty).values({
        employeeId,
        firstName: f.first,
        lastName: f.last,
        email: `${f.first.toLowerCase().replace("ms. ", "")}.${f.last.toLowerCase()}@chocolatekids.edu`,
        phone: `91234${String(10000 + i).slice(-5)}`,
        departmentId: byCode(f.dept).id,
        designation: f.designation,
        joiningDate: "2021-04-01",
        status: "ACTIVE"
      });
      console.log("  Created educator record:", employeeId);
    }
  }

  console.log("Seeding Fee Structures...");
  const fees: schema.Fee[] = [];
  for (const student of students) {
    const existing = await db.query.fees.findFirst({
      where: (row, { and, eq }) => and(eq(row.studentId, student.id), eq(row.academicYear, "2025-26"))
    });
    if (!existing) {
      const totalAmount = "45000.00";
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
      console.log("  Created tuition fee for toddler:", student.studentId);
    } else {
      fees.push(existing);
    }
  }

  console.log("Seeding Fee Receipts...");
  for (let i = 0; i < Math.min(3, fees.length); i++) {
    const fee = fees[i];
    if (!fee || Number(fee.paidAmount) > 0) continue;

    const paymentAmount = 25000;
    const [payment] = await db
      .insert(schema.feePayments)
      .values({
        feeId: fee.id,
        studentId: fee.studentId,
        amount: paymentAmount.toFixed(2),
        paymentDate: "2025-08-10",
        paymentMethod: i % 2 === 0 ? "UPI" : "CARD",
        transactionReference: `TXN2025${String(i + 1).padStart(4, "0")}`,
        remarks: "Term 1 Tuition & Snack Plan Fee"
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

    console.log("  Recorded fee receipt", payment.transactionReference);
  }

  console.log("Seeding School News & Notices...");
  const announcementSeeds = [
    { title: "Annual Kindergarten Carnival & Puppet Show 🎪", content: "Join us this Saturday for a magical day filled with live puppet shows, face painting, organic snacks, and creative games for kids!", published: true },
    { title: "Admissions Open for Session 2025-26 🌟", content: "Enrolling for Playgroup, Nursery, Junior KG, and Daycare. Limited seats per batch to maintain a caring 1:8 caregiver ratio.", published: true },
    { title: "Parent-Teacher Coffee & Progress Morning ☕", content: "Interactive coffee morning with our early childhood specialists to discuss toddler milestone development and sensory play habits.", published: true },
    { title: "Water Play & Summer Splash Safety Notice 🏊", content: "Parents, please send labeled splash suits and soft towels for tomorrow's outdoor sensory water play session.", published: false }
  ];

  for (const a of announcementSeeds) {
    const existing = await db.query.announcements.findFirst({
      where: (row, { eq }) => eq(row.title, a.title)
    });
    if (!existing) {
      await db.insert(schema.announcements).values(a);
      console.log("  Created notice:", a.title);
    }
  }

  console.log("\nChocolate Kids Play School Seed complete! 🍫🎈");
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
