"use client";

import { useState, useEffect, type FormEvent } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { Plus, Edit2, Trash2, Building2 } from "lucide-react";
import type { Department } from "@/db/schema";

export function DepartmentManager() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({ name: "", code: "", description: "" });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  async function fetchDepartments() {
    setLoading(true);
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      if (data.success) setDepartments(data.data);
    } catch (err) {
      console.error("Failed to load departments:", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setFormData({ name: "", code: "", description: "" });
    setFormError(null);
    setIsCreateModalOpen(true);
  }

  function openEditModal(d: Department) {
    setEditingDepartment(d);
    setFormData({ name: d.name, code: d.code, description: d.description || "" });
    setFormError(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const isEdit = !!editingDepartment;
    const url = isEdit ? `/api/departments/${editingDepartment.id}` : "/api/departments";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error?.message || "Failed to save department");
        return;
      }

      setToastType("success");
      setToastMessage(isEdit ? "Department updated!" : "Department created!");
      setIsCreateModalOpen(false);
      setEditingDepartment(null);
      fetchDepartments();
    } catch (err) {
      setFormError("Network error occurred.");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/departments/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setToastType("error");
        setToastMessage(data.error?.message || "Cannot delete department referenced by courses or students.");
        setDeletingDepartmentId(null);
        return;
      }
      setToastType("success");
      setToastMessage("Department deleted.");
      setDeletingDepartmentId(null);
      fetchDepartments();
    } catch (err) {
      setToastType("error");
      setToastMessage("Failed to delete department.");
    }
  }

  const columns: Column<Department>[] = [
    {
      header: "Department Name",
      render: (d) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", backgroundColor: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building2 size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{d.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{d.description || "No description"}</div>
          </div>
        </div>
      )
    },
    {
      header: "Branch Code",
      render: (d) => <Badge variant="info">{d.code}</Badge>
    },
    {
      header: "Actions",
      render: (d) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => openEditModal(d)} className="btn btn-secondary btn-sm">
            <Edit2 size={14} /> Edit
          </button>
          <button onClick={() => setDeletingDepartmentId(d.id)} className="btn btn-danger btn-sm">
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
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Academic Departments</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Manage college departments and academic branch codes</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Add Department
        </button>
      </div>

      <DataTable columns={columns} data={departments} keyExtractor={(d) => d.id} emptyMessage="No departments found." />

      <Modal
        isOpen={isCreateModalOpen || !!editingDepartment}
        onClose={() => { setIsCreateModalOpen(false); setEditingDepartment(null); }}
        title={editingDepartment ? "Edit Department" : "Create New Department"}
      >
        <form onSubmit={handleSave}>
          {formError && (
            <div style={{ color: "var(--danger-text)", backgroundColor: "var(--danger-bg)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
              {formError}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Department Name</label>
            <input
              type="text"
              required
              className="input-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Computer Science & Engineering"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Branch Code</label>
            <input
              type="text"
              required
              className="input-control"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. CSE"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="input-control"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the department..."
            />
          </div>

          <div className="modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
            <button type="button" onClick={() => { setIsCreateModalOpen(false); setEditingDepartment(null); }} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingDepartment ? "Save Changes" : "Create Department"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deletingDepartmentId} onClose={() => setDeletingDepartmentId(null)} title="Confirm Delete Department">
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Are you sure you want to delete this department? Note that departments containing active courses or enrolled students cannot be deleted.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button onClick={() => setDeletingDepartmentId(null)} className="btn btn-secondary">Cancel</button>
          <button onClick={() => deletingDepartmentId && handleDelete(deletingDepartmentId)} className="btn btn-danger">Delete</button>
        </div>
      </Modal>

      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
