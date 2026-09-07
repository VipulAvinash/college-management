"use client";

import { useState, useEffect, type FormEvent } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { Plus, Edit2, Trash2, BookOpen, Clock } from "lucide-react";
import type { Course } from "@/db/schema";

interface Department { id: string; name: string; code: string; }

export function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    durationYears: 4,
    departmentId: ""
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [departmentFilter]);

  async function fetchDepartments() {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      if (data.success) setDepartments(data.data);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  }

  async function fetchCourses() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(departmentFilter && { departmentId: departmentFilter })
      });
      const res = await fetch(`/api/courses?${params.toString()}`);
      const data = await res.json();
      if (data.success) setCourses(data.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setFormData({
      name: "",
      code: "",
      description: "",
      durationYears: 4,
      departmentId: departments[0]?.id || ""
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  }

  function openEditModal(c: Course) {
    setEditingCourse(c);
    setFormData({
      name: c.name,
      code: c.code,
      description: c.description || "",
      durationYears: c.durationYears,
      departmentId: c.departmentId
    });
    setFormError(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const isEdit = !!editingCourse;
    const url = isEdit ? `/api/courses/${editingCourse.id}` : "/api/courses";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error?.message || "Failed to save course");
        return;
      }

      setToastType("success");
      setToastMessage(isEdit ? "Course updated!" : "Course added!");
      setIsCreateModalOpen(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      setFormError("Network error occurred.");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setToastType("error");
        setToastMessage(data.error?.message || "Cannot delete course with enrolled students.");
        setDeletingCourseId(null);
        return;
      }
      setToastType("success");
      setToastMessage("Course deleted.");
      setDeletingCourseId(null);
      fetchCourses();
    } catch (err) {
      setToastType("error");
      setToastMessage("Failed to delete course.");
    }
  }

  const columns: Column<Course>[] = [
    {
      header: "Module Name & Details",
      render: (c) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "#f0f9ff", color: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #bae6fd" }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{c.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{c.description || "No description"}</div>
          </div>
        </div>
      )
    },
    {
      header: "Module Code",
      render: (c) => <Badge variant="info">{c.code}</Badge>
    },
    {
      header: "Play Program",
      render: (c) => {
        const dep = departments.find((d) => d.id === c.departmentId);
        return <span style={{ fontWeight: 700, fontSize: "0.8125rem", color: "#d97706" }}>{dep ? dep.name : "N/A"}</span>;
      }
    },
    {
      header: "Duration",
      render: (c) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
          <Clock size={14} /> {c.durationYears} Term Years
        </div>
      )
    },
    {
      header: "Actions",
      render: (c) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => openEditModal(c)} className="btn btn-secondary btn-sm" title="Edit Module">
            <Edit2 size={14} /> Edit
          </button>
          <button onClick={() => setDeletingCourseId(c.id)} className="btn btn-danger btn-sm" title="Delete Module">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Activity & Learning Modules 🧩
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Manage preschool activity modules, arts & craft labs, phonics, and co-curricular programs.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-amber">
          <Plus size={18} /> Add Activity Module
        </button>
      </div>

      <SearchFilterBar>
        <select
          className="input-control"
          style={{ width: "auto", minWidth: 200 }}
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Play Programs</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
          ))}
        </select>
      </SearchFilterBar>

      <DataTable columns={columns} data={courses} keyExtractor={(c) => c.id} emptyMessage="No courses found." />

      <Modal
        isOpen={isCreateModalOpen || !!editingCourse}
        onClose={() => { setIsCreateModalOpen(false); setEditingCourse(null); }}
        title={editingCourse ? "Edit Course" : "Create New Course"}
      >
        <form onSubmit={handleSave}>
          {formError && (
            <div style={{ color: "var(--danger-text)", backgroundColor: "var(--danger-bg)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
              {formError}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Course Name</label>
              <input
                type="text"
                required
                className="input-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Course Code</label>
              <input
                type="text"
                required
                className="input-control"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. BTCSE"
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
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Duration (Years)</label>
              <input
                type="number"
                min={1}
                max={6}
                required
                className="input-control"
                value={formData.durationYears}
                onChange={(e) => setFormData({ ...formData, durationYears: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="input-control"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
            <button type="button" onClick={() => { setIsCreateModalOpen(false); setEditingCourse(null); }} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCourse ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deletingCourseId} onClose={() => setDeletingCourseId(null)} title="Confirm Delete Course">
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Are you sure you want to delete this course?
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button onClick={() => setDeletingCourseId(null)} className="btn btn-secondary">Cancel</button>
          <button onClick={() => deletingCourseId && handleDelete(deletingCourseId)} className="btn btn-danger">Delete</button>
        </div>
      </Modal>

      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
