"use client";

import { useState, useEffect, type FormEvent } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { Plus, CreditCard, Calendar, UserCheck } from "lucide-react";
import type { Fee, Student } from "@/db/schema";

export function FeeManager() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [students, setStudents] = useState<Student[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({
    studentId: "",
    academicYear: "2025-26",
    totalAmount: 120000,
    dueDate: "2026-03-31"
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchFees();
  }, [page, statusFilter]);

  async function fetchStudents() {
    try {
      const res = await fetch("/api/students?limit=100");
      const data = await res.json();
      if (data.success) setStudents(data.data);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  }

  async function fetchFees() {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter && { status: statusFilter })
      });
      const res = await fetch(`/api/fees?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setFees(data.data);
        setTotal(data.pagination.total);
      }
    } catch (err) {
      console.error("Failed to load fees:", err);
    }
  }

  function openCreateModal() {
    setFormData({
      studentId: students[0]?.id || "",
      academicYear: "2025-26",
      totalAmount: 120000,
      dueDate: "2026-03-31"
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  }

  async function handleCreateFee(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error?.message || "Failed to create fee record");
        return;
      }

      setToastType("success");
      setToastMessage("Fee record generated!");
      setIsCreateModalOpen(false);
      fetchFees();
    } catch (err) {
      setFormError("Network error occurred.");
    }
  }

  const columns: Column<Fee>[] = [
    {
      header: "Toddler / Child Name",
      render: (f) => {
        const s = students.find((st) => st.id === f.studentId);
        return (
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              {s ? `${s.firstName} ${s.lastName}` : "Toddler Record"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Admission ID: {s?.studentId || f.studentId}
            </div>
          </div>
        );
      }
    },
    {
      header: "Play Session",
      render: (f) => <span style={{ fontWeight: 600, fontSize: "0.8125rem", color: "#d97706" }}>{f.academicYear}</span>
    },
    {
      header: "Total Billed",
      render: (f) => <span style={{ fontWeight: 700 }}>₹{Number(f.totalAmount).toLocaleString()}</span>
    },
    {
      header: "Paid Amount",
      render: (f) => (
        <span style={{ fontWeight: 600, color: "#059669" }}>
          ₹{Number(f.paidAmount).toLocaleString()}
        </span>
      )
    },
    {
      header: "Pending Balance",
      render: (f) => (
        <span style={{ fontWeight: 700, color: Number(f.pendingAmount) > 0 ? "#b45309" : "var(--text-muted)" }}>
          ₹{Number(f.pendingAmount).toLocaleString()}
        </span>
      )
    },
    {
      header: "Due Date",
      render: (f) => (
        <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
          {new Date(f.dueDate).toLocaleDateString()}
        </span>
      )
    },
    {
      header: "Status",
      render: (f) => {
        const variant = f.status === "PAID" ? "success" : f.status === "PARTIAL" ? "warning" : f.status === "OVERDUE" ? "danger" : "neutral";
        return <Badge variant={variant}>{f.status}</Badge>;
      }
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Tuition & Daycare Fees 💳
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Track toddler tuition plans, daycare billing cycles, and fee statuses.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-amber">
          <Plus size={18} /> Create Fee Plan
        </button>
      </div>

      <SearchFilterBar>
        <select
          className="input-control"
          style={{ width: "auto", minWidth: 180 }}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="PARTIAL">PARTIAL</option>
          <option value="PAID">PAID</option>
          <option value="OVERDUE">OVERDUE</option>
        </select>
      </SearchFilterBar>

      <DataTable
        columns={columns}
        data={fees}
        keyExtractor={(f) => f.id}
        emptyMessage="No fee records found."
        pagination={{ page, limit: 10, total, onPageChange: setPage }}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Generate Student Fee Record">
        <form onSubmit={handleCreateFee}>
          {formError && (
            <div style={{ color: "var(--danger-text)", backgroundColor: "var(--danger-bg)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Student</label>
            <select
              className="input-control"
              required
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.studentId})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <input
                type="text"
                required
                className="input-control"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="2025-26"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Fee Amount (₹)</label>
              <input
                type="number"
                min={0}
                required
                className="input-control"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Due Date</label>
            <input
              type="date"
              required
              className="input-control"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Generate Fee Record
            </button>
          </div>
        </form>
      </Modal>

      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
