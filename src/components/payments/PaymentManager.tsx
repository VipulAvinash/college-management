"use client";

import { useState, useEffect, type FormEvent } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { Plus, Receipt, CreditCard, DollarSign } from "lucide-react";
import type { FeePayment, Fee, Student } from "@/db/schema";

export function PaymentManager() {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [methodFilter, setMethodFilter] = useState("");

  const [fees, setFees] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({
    feeId: "",
    studentId: "",
    amount: 10000,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "UPI",
    transactionReference: "",
    remarks: ""
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [page, methodFilter]);

  async function fetchMetadata() {
    try {
      const [feeRes, stuRes] = await Promise.all([
        fetch("/api/fees?limit=100"),
        fetch("/api/students?limit=100")
      ]);
      const feeData = await feeRes.json();
      const stuData = await stuRes.json();
      if (feeData.success) setFees(feeData.data);
      if (stuData.success) setStudents(stuData.data);
    } catch (err) {
      console.error("Failed to load metadata:", err);
    }
  }

  async function fetchPayments() {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(methodFilter && { paymentMethod: methodFilter })
      });
      const res = await fetch(`/api/payments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
        setTotal(data.pagination.total);
      }
    } catch (err) {
      console.error("Failed to load payments:", err);
    }
  }

  function openCreateModal() {
    const firstFee = fees.find((f) => Number(f.pendingAmount) > 0) || fees[0];
    setFormData({
      feeId: firstFee?.id || "",
      studentId: firstFee?.studentId || students[0]?.id || "",
      amount: firstFee ? Number(firstFee.pendingAmount) : 10000,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "UPI",
      transactionReference: `TXN${Date.now().toString().slice(-6)}`,
      remarks: "Semester Fee Payment"
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  }

  async function handleRecordPayment(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error?.message || "Failed to record payment");
        return;
      }

      setToastType("success");
      setToastMessage("Payment recorded successfully!");
      setIsCreateModalOpen(false);
      fetchPayments();
      fetchMetadata();
    } catch (err) {
      setFormError("Network error occurred.");
    }
  }

  const selectedFee = fees.find((f) => f.id === formData.feeId);

  const columns: Column<FeePayment>[] = [
    {
      header: "Transaction Reference",
      render: (p) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", backgroundColor: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Receipt size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontFamily: "monospace", color: "var(--text-primary)" }}>
              {p.transactionReference || "N/A"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {new Date(p.paymentDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Student",
      render: (p) => {
        const s = students.find((st) => st.id === p.studentId);
        return (
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{s ? `${s.firstName} ${s.lastName}` : "Student Record"}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s?.studentId || p.studentId}</div>
          </div>
        );
      }
    },
    {
      header: "Amount Paid",
      render: (p) => <span style={{ fontWeight: 800, color: "var(--success-text)", fontSize: "0.9375rem" }}>₹{Number(p.amount).toLocaleString()}</span>
    },
    {
      header: "Method",
      render: (p) => <Badge variant="info">{p.paymentMethod}</Badge>
    },
    {
      header: "Remarks",
      render: (p) => <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{p.remarks || "N/A"}</span>
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Payment History</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Audit log of recorded fee transactions and payments</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Record New Payment
        </button>
      </div>

      <SearchFilterBar>
        <select
          className="input-control"
          style={{ width: "auto", minWidth: 180 }}
          value={methodFilter}
          onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Payment Methods</option>
          <option value="UPI">UPI</option>
          <option value="CASH">CASH</option>
          <option value="CARD">CARD</option>
          <option value="BANK_TRANSFER">BANK_TRANSFER</option>
          <option value="OTHER">OTHER</option>
        </select>
      </SearchFilterBar>

      <DataTable
        columns={columns}
        data={payments}
        keyExtractor={(p) => p.id}
        emptyMessage="No payment transactions recorded."
        pagination={{ page, limit: 10, total, onPageChange: setPage }}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Record Fee Payment">
        <form onSubmit={handleRecordPayment}>
          {formError && (
            <div style={{ color: "var(--danger-text)", backgroundColor: "var(--danger-bg)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Fee Record</label>
            <select
              className="input-control"
              required
              value={formData.feeId}
              onChange={(e) => {
                const fId = e.target.value;
                const f = fees.find((item) => item.id === fId);
                setFormData({
                  ...formData,
                  feeId: fId,
                  studentId: f?.studentId || "",
                  amount: f ? Number(f.pendingAmount) : 10000
                });
              }}
            >
              {fees.map((f) => {
                const s = students.find((st) => st.id === f.studentId);
                return (
                  <option key={f.id} value={f.id}>
                    {s ? `${s.firstName} ${s.lastName}` : "Student"} - Year {f.academicYear} (Pending: ₹{Number(f.pendingAmount).toLocaleString()})
                  </option>
                );
              })}
            </select>
          </div>

          {selectedFee && (
            <div style={{ padding: "0.875rem", backgroundColor: "#f8fafc", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", marginBottom: "1.25rem", fontSize: "0.8125rem" }}>
              <div>Total Billed: <strong>₹{Number(selectedFee.totalAmount).toLocaleString()}</strong></div>
              <div>Current Pending Balance: <strong style={{ color: "var(--warning-text)" }}>₹{Number(selectedFee.pendingAmount).toLocaleString()}</strong></div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Payment Amount (₹)</label>
              <input
                type="number"
                min={1}
                max={selectedFee ? Number(selectedFee.pendingAmount) : 1000000}
                required
                className="input-control"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="input-control"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="UPI">UPI</option>
                <option value="CASH">CASH</option>
                <option value="CARD">CARD</option>
                <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Transaction Ref / Reference ID</label>
              <input
                type="text"
                className="input-control"
                value={formData.transactionReference}
                onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
                placeholder="e.g. UPI/12345678"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Date</label>
              <input
                type="date"
                required
                className="input-control"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Remarks (Optional)</label>
            <input
              type="text"
              className="input-control"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="e.g. Paid via Google Pay"
            />
          </div>

          <div className="modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Payment
            </button>
          </div>
        </form>
      </Modal>

      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
