import { pgEnum } from "drizzle-orm/pg-core";

// Kept in one file so every enum's allowed values are easy to audit together.
export const userRoleEnum = pgEnum("user_role", ["ADMIN"]);

export const studentStatusEnum = pgEnum("student_status", [
  "ACTIVE",
  "INACTIVE",
  "GRADUATED",
  "SUSPENDED"
]);

export const facultyStatusEnum = pgEnum("faculty_status", [
  "ACTIVE",
  "INACTIVE",
  "ON_LEAVE"
]);

export const feeStatusEnum = pgEnum("fee_status", [
  "PENDING",
  "PARTIAL",
  "PAID",
  "OVERDUE"
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "CASH",
  "BANK_TRANSFER",
  "UPI",
  "CARD",
  "OTHER"
]);

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE", "OTHER"]);
