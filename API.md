# API Reference

All responses follow:

```json
// success
{ "success": true, "data": {} }

// success (list)
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }

// error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

Unless noted, **every endpoint below requires Admin authentication** via the
`session_id` HTTP-only cookie set by `POST /api/auth/login`.

---

## Auth

### POST /api/auth/login
Auth: none

Request:
```json
{ "email": "admin@college.com", "password": "Admin@123" }
```
Response: `200` admin object (no `passwordHash`).
Errors: `401 AUTHENTICATION_ERROR` invalid credentials, `422 VALIDATION_ERROR`.

### POST /api/auth/logout
Auth: Admin required. Deletes the current session. Response: `200`.

### GET /api/auth/me
Auth: Admin required. Response: `200` current admin object. `401` if not
authenticated.

---

## Dashboard

### GET /api/dashboard
Auth: Admin required.
Response `200`:
```json
{
  "students": { "total": 10, "active": 10 },
  "faculty": { "total": 5, "active": 5 },
  "departments": { "total": 5 },
  "courses": { "total": 6 },
  "fees": { "total": 1200000, "paid": 200000, "pending": 1000000, "pendingCount": 6, "overdueCount": 0, "paidCount": 0 },
  "recent": { "students": [...], "payments": [...], "announcements": [...] }
}
```

---

## Departments

### GET /api/departments
Auth: Admin. Response: array of departments (no pagination - small table).

### POST /api/departments
Auth: Admin.
Request: `{ "name": "Computer Science", "code": "CSE", "description": "..." }`
Errors: `409 CONFLICT` if `code` already exists, `422` validation.

### GET /api/departments/[id]
Auth: Admin. `404 NOT_FOUND` if missing.

### PATCH /api/departments/[id]
Auth: Admin. Partial body of the create schema.

### DELETE /api/departments/[id]
Auth: Admin. `400 BAD_REQUEST` if courses/faculty/students still reference it.

---

## Courses

### GET /api/courses?departmentId=...
Auth: Admin. `departmentId` optional filter.

### POST /api/courses
Request: `{ "name", "code", "description?", "durationYears", "departmentId" }`
Errors: `404` if `departmentId` doesn't exist, `409` if `code` taken.

### GET /api/courses/[id]
### PATCH /api/courses/[id]
### DELETE /api/courses/[id]
`400 BAD_REQUEST` if students are enrolled in it.

---

## Students

### GET /api/students
Auth: Admin. Query params (all optional):
`page, limit, search, departmentId, courseId, year, semester, status`
`search` matches `studentId, firstName, lastName, email, phone` (SQL `ILIKE`,
executed at the database level).

### POST /api/students
Request:
```json
{
  "studentId": "STU2026011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "dateOfBirth": "2005-01-01",
  "gender": "MALE",
  "address": "optional",
  "departmentId": "uuid",
  "courseId": "uuid",
  "year": 1,
  "semester": 1,
  "admissionDate": "2025-07-01",
  "status": "ACTIVE"
}
```
Errors: `404` bad department/course id, `409 CONFLICT` if the course doesn't
belong to the department, or if `studentId`/`email` already exist.

### GET /api/students/[id]
### PATCH /api/students/[id]
Partial body of create schema.
### DELETE /api/students/[id]
Hard-deletes the student (fee/payment history cascades via FK).

---

## Faculty

### GET /api/faculty
Query: `page, limit, search, departmentId, status`. `search` matches
`employeeId, firstName, lastName, email`.

### POST /api/faculty
Request:
```json
{
  "employeeId": "EMP2026006",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@college.com",
  "phone": "9123456780",
  "departmentId": "uuid",
  "designation": "Assistant Professor",
  "joiningDate": "2020-01-01",
  "status": "ACTIVE"
}
```

### GET /api/faculty/[id]
### PATCH /api/faculty/[id]
### DELETE /api/faculty/[id]

---

## Fees

### GET /api/fees
Query: `page, limit, studentId, status, academicYear`

### POST /api/fees
Request: `{ "studentId", "academicYear", "totalAmount", "dueDate" }`
Creates a fee with `paidAmount=0`, `pendingAmount=totalAmount`, and a status
computed from the due date (`PENDING` or `OVERDUE`).

### GET /api/fees/[id]
### PATCH /api/fees/[id]
Request (all optional): `{ "academicYear", "totalAmount", "dueDate", "status" }`
Recomputes `pendingAmount`/`status` if `totalAmount`/`dueDate` change, unless
`status` is explicitly provided.

---

## Payments

### GET /api/payments
Query: `page, limit, studentId, feeId, paymentMethod, dateFrom, dateTo`

### POST /api/payments
Request:
```json
{
  "feeId": "uuid",
  "studentId": "uuid",
  "amount": 25000,
  "paymentDate": "2026-01-15",
  "paymentMethod": "UPI",
  "transactionReference": "optional, must be unique if provided",
  "remarks": "optional"
}
```
Business logic (single DB transaction):
```
paidAmount    = fee.paidAmount + amount
pendingAmount = fee.totalAmount - paidAmount
status        = PAID if pendingAmount == 0
              else OVERDUE if past due date
              else PARTIAL if paidAmount > 0
              else PENDING
```
Errors: `400 BAD_REQUEST` if `amount` exceeds current pending balance, or the
fee doesn't belong to the given student; `409 CONFLICT` on a duplicate
`transactionReference`; `404` for a bad `feeId`/`studentId`.
Response `201`: `{ "payment": {...}, "fee": {...updated fee...} }`

### GET /api/payments/[id]

---

## Announcements

### GET /api/announcements
Auth: Admin. Query: `page, limit, published`.
(For the **public** site, published announcements are rendered server-side
via `announcementService.listPublished()` on `/` - not through this
authenticated endpoint.)

### POST /api/announcements
Request: `{ "title", "content", "published"? }` (defaults `published: false`)

### GET /api/announcements/[id]
### PATCH /api/announcements/[id]
### DELETE /api/announcements/[id]

---

## Error Codes

| Code                  | HTTP Status |
|-----------------------|-------------|
| VALIDATION_ERROR       | 422 |
| AUTHENTICATION_ERROR   | 401 |
| AUTHORIZATION_ERROR    | 403 |
| NOT_FOUND              | 404 |
| CONFLICT               | 409 |
| BAD_REQUEST            | 400 |
| DATABASE_ERROR         | 500 |
| INTERNAL_ERROR         | 500 |
