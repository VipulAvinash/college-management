"use client";

import { useState, useEffect, type FormEvent } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { Plus, Edit2, Trash2, Mail, Phone, Calendar, UserCheck } from "lucide-react";
import type { Student } from "@/db/schema";

interface Department { id: string; name: string; code: string; }
interface Course { id: string; name: string; code: string; departmentId: string; }

export function StudentsManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Form State
  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
    address: "",
    departmentId: "",
    courseId: "",
    year: 1,
    semester: 1,
    admissionDate: new Date().toISOString().split("T")[0],
    status: "ACTIVE"
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [page, search, departmentId, courseId, statusFilter]);

  async function fetchMetadata() {
    try {
      const [depRes, crsRes] = await Promise.all([
        fetch("/api/departments"),
        fetch("/api/courses")
      ]);
      const depData = await depRes.json();
      const crsData = await crsRes.json();
      if (depData.success) setDepartments(depData.data);
      if (crsData.success) setCourses(crsData.data);
    } catch (err) {
      console.error("Failed to load metadata:", err);
    }
  }

  async function fetchStudents() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(departmentId && { departmentId }),
        ...(courseId && { courseId }),
        ...(statusFilter && { status: statusFilter })
      });
      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
        setTotal(data.pagination.total);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    const nextDep = departments[0]?.id || "";
    const filteredCrs = courses.filter((c) => c.departmentId === nextDep);
    setFormData({
      studentId: `STU${Date.now().toString().slice(-6)}`,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "2004-05-15",
      gender: "MALE",
      address: "",
      departmentId: nextDep,
      courseId: filteredCrs[0]?.id || "",
      year: 1,
      semester: 1,
      admissionDate: new Date().toISOString().split("T")[0],
      status: "ACTIVE"
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  }

  function openEditModal(student: Student) {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      dateOfBirth: String(student.dateOfBirth).split("T")[0] || "",
      gender: student.gender,
      address: student.address || "",
      departmentId: student.departmentId,
      courseId: student.courseId,
      year: student.year,
      semester: student.semester,
      admissionDate: String(student.admissionDate).split("T")[0] || "",
      status: student.status
    });
    setFormError(null);
  }

  async function handleSaveStudent(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const isEdit = !!editingStudent;
    const url = isEdit ? `/api/students/${editingStudent.id}` : "/api/students";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error?.message || "Failed to save student record");
        return;
      }

      setToastType("success");
      setToastMessage(isEdit ? "Student updated successfully!" : "Student enrolled successfully!");
      setIsCreateModalOpen(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      setFormError("Network error occurred.");
    }
  }

  async function handleDeleteStudent(id: string) {
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setToastType("error");
        setToastMessage(data.error?.message || "Failed to delete student");
        return;
      }
      setToastType("success");
      setToastMessage("Student record deleted.");
      setDeletingStudentId(null);
      fetchStudents();
    } catch (err) {
      setToastType("error");
      setToastMessage("Failed to delete student.");
    }
  }

  const columns: Column<Student>[] = [
    {
      header: "Toddler / Child Info",
      render: (s) => (
        <div>
          <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
            {s.firstName} {s.lastName}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <span style={{ fontFamily: "monospace", background: "#fef3c7", color: "#d97706", padding: "0.125rem 0.375rem", borderRadius: 4, fontWeight: 700 }}>
              ID: {s.studentId}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Parent Contact",
      render: (s) => (
        <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Mail size={13} color="var(--text-muted)" /> {s.email}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.125rem" }}>
            <Phone size={13} color="var(--text-muted)" /> Emergency: {s.phone}
          </div>
        </div>
      )
    },
    {
      header: "Play Program & Module",
      render: (s) => {
        const dep = departments.find((d) => d.id === s.departmentId);
        const crs = courses.find((c) => c.id === s.courseId);
        return (
          <div style={{ fontSize: "0.8125rem" }}>
            <div style={{ fontWeight: 700, color: "#d97706" }}>{dep ? dep.name : "N/A"}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              {crs ? crs.name : "N/A"}
            </div>
          </div>
        );
      }
    },
    {
      header: "Status",
      render: (s) => {
        const variant = s.status === "ACTIVE" ? "success" : s.status === "GRADUATED" ? "info" : "neutral";
        return <Badge variant={variant}>{s.status}</Badge>;
      }
    },
    {
      header: "Actions",
      render: (s) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => openEditModal(s)}
            className="btn btn-secondary btn-sm"
            title="Edit Toddler Info"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeletingStudentId(s.id)}
            className="btn btn-danger btn-sm"
            title="Remove Record"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const availableCourses = courses.filter((c) => c.departmentId === formData.departmentId);

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Kids & Toddlers Directory 🧸
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Manage enrolled children, parent contacts, program age batches, and emergency information.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchQuery={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        placeholder="Search by kid name, admission ID, or parent email..."
        actionButton={
          <button onClick={openCreateModal} className="btn btn-amber">
            <Plus size={18} /> Enroll New Toddler
          </button>
        }
      >
        <select
          className="input-control"
          style={{ width: "auto", minWidth: 160 }}
          value={departmentId}
          onChange={(e) => { setDepartmentId(e.target.value); setPage(1); }}
        >
          <option value="">All Play Programs</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
          ))}
        </select>

        <select
          className="input-control"
          style={{ width: "auto", minWidth: 160 }}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="GRADUATED">GRADUATED</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>
      </SearchFilterBar>

      {/* Table */}
      <DataTable
        columns={columns}
        data={students}
        keyExtractor={(s) => s.id}
        emptyMessage="No students found matching your criteria."
        pagination={{
          page,
          limit: 10,
          total,
          onPageChange: (newPage) => setPage(newPage)
        }}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || !!editingStudent}
        onClose={() => { setIsCreateModalOpen(false); setEditingStudent(null); }}
        title={editingStudent ? "Edit Student Record" : "Enroll New Student"}
      >
        <form onSubmit={handleSaveStudent}>
          {formError && (
            <div style={{ color: "var(--danger-text)", backgroundColor: "var(--danger-bg)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
              {formError}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Student Roll/ID</label>
              <input
                type="text"
                required
                className="input-control"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="input-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                required
                className="input-control"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                required
                className="input-control"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                className="input-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="text"
                required
                className="input-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="input-control"
                required
                value={formData.departmentId}
                onChange={(e) => {
                  const depId = e.target.value;
                  const firstCourse = courses.find((c) => c.departmentId === depId)?.id || "";
                  setFormData({ ...formData, departmentId: depId, courseId: firstCourse });
                }}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Course</label>
              <select
                className="input-control"
                required
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              >
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <input
                type="number"
                min={1}
                max={5}
                required
                className="input-control"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Semester</label>
              <input
                type="number"
                min={1}
                max={10}
                required
                className="input-control"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="input-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="GRADUATED">GRADUATED</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                required
                className="input-control"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Admission Date</label>
              <input
                type="date"
                required
                className="input-control"
                value={formData.admissionDate}
                onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
            <button type="button" onClick={() => { setIsCreateModalOpen(false); setEditingStudent(null); }} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingStudent ? "Save Changes" : "Enroll Student"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deletingStudentId}
        onClose={() => setDeletingStudentId(null)}
        title="Confirm Delete Student"
      >
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Are you sure you want to delete this student record? This action will permanently remove their records, fees, and payment logs.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button onClick={() => setDeletingStudentId(null)} className="btn btn-secondary">Cancel</button>
          <button onClick={() => deletingStudentId && handleDeleteStudent(deletingStudentId)} className="btn btn-danger">
            Delete Permanently
          </button>
        </div>
      </Modal>

      {/* Toast Feedback */}
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
