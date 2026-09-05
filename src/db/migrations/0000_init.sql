-- Initial schema for College Management System
-- Hand-written to exactly match src/db/schema/*.ts (network access was
-- unavailable to run `drizzle-kit generate` in this environment).
-- Run `npm run db:generate` locally after `npm install` to have Drizzle
-- regenerate/verify this migration and its journal metadata.

DO $$ BEGIN CREATE TYPE "user_role" AS ENUM ('ADMIN'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "student_status" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'SUSPENDED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "faculty_status" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "fee_status" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "payment_method" AS ENUM ('CASH', 'BANK_TRANSFER', 'UPI', 'CARD', 'OTHER'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "gender" AS ENUM ('MALE', 'FEMALE', 'OTHER'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Admins ONLY. Never linked to students/faculty.
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(150) NOT NULL,
  "email" varchar(255) NOT NULL UNIQUE,
  "password_hash" varchar(255) NOT NULL,
  "role" "user_role" NOT NULL DEFAULT 'ADMIN',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "sessions" ("user_id");
CREATE INDEX IF NOT EXISTS "sessions_expires_at_idx" ON "sessions" ("expires_at");

CREATE TABLE IF NOT EXISTS "departments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(150) NOT NULL,
  "code" varchar(20) NOT NULL UNIQUE,
  "description" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "courses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(150) NOT NULL,
  "code" varchar(20) NOT NULL UNIQUE,
  "description" text,
  "duration_years" integer NOT NULL,
  "department_id" uuid NOT NULL REFERENCES "departments"("id") ON DELETE RESTRICT,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "courses_department_id_idx" ON "courses" ("department_id");

-- Students: DATA ONLY. No password/auth columns, no FK to users.
CREATE TABLE IF NOT EXISTS "students" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "student_id" varchar(30) NOT NULL UNIQUE,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "email" varchar(255) NOT NULL UNIQUE,
  "phone" varchar(20) NOT NULL,
  "date_of_birth" date NOT NULL,
  "gender" "gender" NOT NULL,
  "address" text,
  "department_id" uuid NOT NULL REFERENCES "departments"("id") ON DELETE RESTRICT,
  "course_id" uuid NOT NULL REFERENCES "courses"("id") ON DELETE RESTRICT,
  "year" integer NOT NULL,
  "semester" integer NOT NULL,
  "admission_date" date NOT NULL,
  "status" "student_status" NOT NULL DEFAULT 'ACTIVE',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "students_student_id_idx" ON "students" ("student_id");
CREATE INDEX IF NOT EXISTS "students_email_idx" ON "students" ("email");
CREATE INDEX IF NOT EXISTS "students_department_id_idx" ON "students" ("department_id");
CREATE INDEX IF NOT EXISTS "students_course_id_idx" ON "students" ("course_id");
CREATE INDEX IF NOT EXISTS "students_status_idx" ON "students" ("status");

-- Faculty: DATA ONLY. No password/auth columns, no FK to users.
CREATE TABLE IF NOT EXISTS "faculty" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "employee_id" varchar(30) NOT NULL UNIQUE,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "email" varchar(255) NOT NULL UNIQUE,
  "phone" varchar(20) NOT NULL,
  "department_id" uuid NOT NULL REFERENCES "departments"("id") ON DELETE RESTRICT,
  "designation" varchar(100) NOT NULL,
  "joining_date" date NOT NULL,
  "status" "faculty_status" NOT NULL DEFAULT 'ACTIVE',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "faculty_employee_id_idx" ON "faculty" ("employee_id");
CREATE INDEX IF NOT EXISTS "faculty_email_idx" ON "faculty" ("email");
CREATE INDEX IF NOT EXISTS "faculty_department_id_idx" ON "faculty" ("department_id");
CREATE INDEX IF NOT EXISTS "faculty_status_idx" ON "faculty" ("status");

CREATE TABLE IF NOT EXISTS "fees" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "student_id" uuid NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
  "academic_year" varchar(20) NOT NULL,
  "total_amount" numeric(12,2) NOT NULL,
  "paid_amount" numeric(12,2) NOT NULL DEFAULT 0,
  "pending_amount" numeric(12,2) NOT NULL,
  "due_date" date NOT NULL,
  "status" "fee_status" NOT NULL DEFAULT 'PENDING',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "fees_total_amount_check" CHECK ("total_amount" >= 0),
  CONSTRAINT "fees_paid_amount_check" CHECK ("paid_amount" >= 0),
  CONSTRAINT "fees_pending_amount_check" CHECK ("pending_amount" >= 0)
);
CREATE INDEX IF NOT EXISTS "fees_student_id_idx" ON "fees" ("student_id");
CREATE INDEX IF NOT EXISTS "fees_status_idx" ON "fees" ("status");
CREATE INDEX IF NOT EXISTS "fees_academic_year_idx" ON "fees" ("academic_year");

CREATE TABLE IF NOT EXISTS "fee_payments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "fee_id" uuid NOT NULL REFERENCES "fees"("id") ON DELETE CASCADE,
  "student_id" uuid NOT NULL REFERENCES "students"("id") ON DELETE CASCADE,
  "amount" numeric(12,2) NOT NULL,
  "payment_date" date NOT NULL,
  "payment_method" "payment_method" NOT NULL,
  "transaction_reference" varchar(100),
  "remarks" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "fee_payments_amount_check" CHECK ("amount" > 0)
);
CREATE INDEX IF NOT EXISTS "fee_payments_student_id_idx" ON "fee_payments" ("student_id");
CREATE INDEX IF NOT EXISTS "fee_payments_fee_id_idx" ON "fee_payments" ("fee_id");
CREATE INDEX IF NOT EXISTS "fee_payments_payment_date_idx" ON "fee_payments" ("payment_date");
CREATE INDEX IF NOT EXISTS "fee_payments_transaction_reference_idx" ON "fee_payments" ("transaction_reference");
-- Prevents accidental double-recording of the same bank/UPI transaction.
CREATE UNIQUE INDEX IF NOT EXISTS "fee_payments_transaction_reference_unique_idx"
  ON "fee_payments" ("transaction_reference")
  WHERE "transaction_reference" IS NOT NULL;

CREATE TABLE IF NOT EXISTS "announcements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" varchar(200) NOT NULL,
  "content" text NOT NULL,
  "published" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "announcements_published_idx" ON "announcements" ("published");

