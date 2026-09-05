"use client";

import { useState, useEffect, type FormEvent } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { Plus, Edit2, Trash2, Mail, Phone, Calendar, Briefcase } from "lucide-react";
import type { Faculty } from "@/db/schema";

interface Department { id: string; name: string; code: string; }

export function FacultyManager() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [departments, setDepartments] = useState<Department[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deletingFacultyId, setDeletingFacultyId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departmentId: "",
    designation: "Assistant Professor",
    joiningDate: new Date().toISOString().split("T")[0],
    status: "ACTIVE"
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchFaculty();
  }, [page, search, departmentId, statusFilter]);

  async function fetchDepartments() {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      if (data.success) setDepartments(data.data);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  }

  async function fetchFaculty() {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(departmentId && { departmentId }),
        ...(statusFilter && { status: statusFilter })
      });
      const res = await fetch(`/api/faculty?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setFacultyList(data.data);
        setTotal(data.pagination.total);
      }
    } catch (err) {
      console.error("Failed to load faculty:", err);
    }
  }

  function openCreateModal() {
    setFormData({
      employeeId: `EMP${Date.now().toString().slice(-6)}`,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: departments[0]?.id || "",
      designation: "Assistant Professor",
      joiningDate: new Date().toISOString().split("T")[0],
      status: "ACTIVE"
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  }

  function openEditModal(f: Faculty) {
    setEditingFaculty(f);
    setFormData({
      employeeId: f.employeeId,
      firstName: f.firstName,
      lastName: f.lastName,
      email: f.email,
      phone: f.phone,
      departmentId: f.departmentId,
      designation: f.designation,
      joiningDate: String(f.joiningDate).split("T")[0],
      status: f.status
    });
    setFormError(null);
  }

  async function handleSaveFaculty(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const isEdit = !!editingFaculty;
    const url = isEdit ? `/api/faculty/${editingFaculty.id}` : "/api/faculty";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error?.message || "Failed to save faculty record");
        return;
      }

      setToastType("success");
      setToastMessage(isEdit ? "Faculty record updated!" : "Faculty member registered!");
      setIsCreateModalOpen(false);
      setEditingFaculty(null);
      fetchFaculty();
    } catch (err) {
      setFormError("Network error occurred.");
    }
  }

  async function handleDeleteFaculty(id: string) {
    try {
      const res = await fetch(`/api/faculty/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setToastType("error");
        setToastMessage(data.error?.message || "Failed to remove faculty member");
        return;
      }
      setToastType("success");
      setToastMessage("Faculty record removed.");
      setDeletingFacultyId(null);
      fetchFaculty();
    } catch (err) {
      setToastType("error");
      setToastMessage("Network error occurred.");
    }
  }

  const columns: Column<Faculty>[] = [
    {
      header: "Faculty Info",
      render: (f) => (
        <div>
          <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
            {f.firstName} {f.lastName}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <span style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "0.125rem 0.375rem", borderRadius: 4 }}>
              {f.employeeId}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Designation & Dept",
      render: (f) => {
        const dep = departments.find((d) => d.id === f.departmentId);
        return (
          <div style={{ fontSize: "0.8125rem" }}>
            <div style={{ fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <Briefcase size={13} color="var(--text-muted)" /> {f.designation}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {dep ? dep.name : "N/A"} ({dep?.code})
            </div>
          </div>
        );
      }
    },
    {
      header: "Contact",
      render: (f) => (
        <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Mail size={13} color="var(--text-muted)" /> {f.email}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.125rem" }}>
            <Phone size={13} color="var(--text-muted)" /> {f.phone}
          </div>
        </div>
      )
    },
    {
      header: "Status",
      render: (f) => {
        const variant = f.status === "ACTIVE" ? "success" : f.status === "ON_LEAVE" ? "warning" : "neutral";
        return <Badge variant={variant}>{f.status}</Badge>;
      }
    },
    {
      header: "Actions",
      render: (f) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => openEditModal(f)} className="btn btn-secondary btn-sm">
            <Edit2 size={14} />
          </button>
          <button onClick={() => setDeletingFacultyId(f.id)} className="btn btn-danger btn-sm">
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Faculty Directory</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Manage teaching staff, designations, and departmental assignments</p>
        </div>
      </div>

      <SearchFilterBar
        searchQuery={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        placeholder="Search by Employee ID, name or email..."
        actionButton={
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={18} /> Add Faculty Member
          </button>
        }
      >
        <select
          className="input-control"
          style={{ width: "auto", minWidth: 160 }}
          value={departmentId}
          onChange={(e) => { setDepartmentId(e.target.value); setPage(1); }}
        >
          <option value="">All Departments</option>
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
          <option value="ON_LEAVE">ON_LEAVE</option>
        </select>
      </SearchFilterBar>

      <DataTable
        columns={columns}
        data={facultyList}
        keyExtractor={(f) => f.id}
        emptyMessage="No faculty members found."
        pagination={{ page, limit: 10, total, onPageChange: setPage }}
      />

      <Modal
        isOpen={isCreateModalOpen || !!editingFaculty}
        onClose={() => { setIsCreateModalOpen(false); setEditingFaculty(null); }}
        title={editingFaculty ? "Edit Faculty Member" : "Register New Faculty Member"}
      >
        <form onSubmit={handleSaveFaculty}>
          {formError && (
            <div style={{ color: "var(--danger-text)", backgroundColor: "var(--danger-bg)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
              {formError}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Employee ID</label>
              <input
                type="text"
                required
                className="input-control"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                required
                className="input-control"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Professor, Assistant Professor"
              />
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
              <label className="form-label">Email Address</label>
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div className="form-group" style={{ gridColumn: "span 2" }}>
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
              <label className="form-label">Status</label>
              <select
                className="input-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Joining Date</label>
            <input
              type="date"
              required
              className="input-control"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
            <button type="button" onClick={() => { setIsCreateModalOpen(false); setEditingFaculty(null); }} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingFaculty ? "Save Changes" : "Register Faculty Member"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deletingFacultyId} onClose={() => setDeletingFacultyId(null)} title="Confirm Delete Faculty Member">
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Are you sure you want to remove this faculty record? This action cannot be undone.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button onClick={() => setDeletingFacultyId(null)} className="btn btn-secondary">Cancel</button>
          <button onClick={() => deletingFacultyId && handleDeleteFaculty(deletingFacultyId)} className="btn btn-danger">Delete</button>
        </div>
      </Modal>

      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
