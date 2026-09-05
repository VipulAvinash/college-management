"use client";

import { useState, useEffect, type FormEvent } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { Plus, Edit2, Trash2, Megaphone, CheckCircle2, Eye, EyeOff } from "lucide-react";
import type { Announcement } from "@/db/schema";

export function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [publishedFilter, setPublishedFilter] = useState<string>("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    published: true
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [page, publishedFilter]);

  async function fetchAnnouncements() {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(publishedFilter && { published: publishedFilter })
      });
      const res = await fetch(`/api/announcements?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.data);
        setTotal(data.pagination.total);
      }
    } catch (err) {
      console.error("Failed to load announcements:", err);
    }
  }

  function openCreateModal() {
    setFormData({ title: "", content: "", published: true });
    setFormError(null);
    setIsCreateModalOpen(true);
  }

  function openEditModal(a: Announcement) {
    setEditingAnnouncement(a);
    setFormData({
      title: a.title,
      content: a.content,
      published: a.published
    });
    setFormError(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const isEdit = !!editingAnnouncement;
    const url = isEdit ? `/api/announcements/${editingAnnouncement.id}` : "/api/announcements";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error?.message || "Failed to save announcement");
        return;
      }

      setToastType("success");
      setToastMessage(isEdit ? "Announcement updated!" : "Announcement posted!");
      setIsCreateModalOpen(false);
      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (err) {
      setFormError("Network error occurred.");
    }
  }

  async function togglePublish(a: Announcement) {
    try {
      const res = await fetch(`/api/announcements/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !a.published })
      });
      const data = await res.json();
      if (data.success) {
        setToastType("success");
        setToastMessage(a.published ? "Announcement hidden from public feed." : "Announcement published to homepage!");
        fetchAnnouncements();
      }
    } catch (err) {
      setToastType("error");
      setToastMessage("Failed to update status.");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setToastType("success");
        setToastMessage("Announcement deleted.");
        setDeletingId(null);
        fetchAnnouncements();
      }
    } catch (err) {
      setToastType("error");
      setToastMessage("Failed to delete announcement.");
    }
  }

  const columns: Column<Announcement>[] = [
    {
      header: "Announcement Title & Content",
      render: (a) => (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", backgroundColor: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Megaphone size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{a.title}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.4 }}>
              {a.content}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
              Created: {new Date(a.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      render: (a) => (
        <Badge variant={a.published ? "success" : "neutral"}>
          {a.published ? "PUBLISHED" : "DRAFT"}
        </Badge>
      )
    },
    {
      header: "Actions",
      render: (a) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => togglePublish(a)}
            className="btn btn-secondary btn-sm"
            title={a.published ? "Unpublish" : "Publish"}
          >
            {a.published ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={() => openEditModal(a)} className="btn btn-secondary btn-sm">
            <Edit2 size={14} />
          </button>
          <button onClick={() => setDeletingId(a.id)} className="btn btn-danger btn-sm">
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
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Campus Announcements</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Publish news, notices, and deadlines to the public landing page</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> New Announcement
        </button>
      </div>

      <SearchFilterBar>
        <select
          className="input-control"
          style={{ width: "auto", minWidth: 160 }}
          value={publishedFilter}
          onChange={(e) => { setPublishedFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="true">Published</option>
          <option value="false">Drafts</option>
        </select>
      </SearchFilterBar>

      <DataTable
        columns={columns}
        data={announcements}
        keyExtractor={(a) => a.id}
        emptyMessage="No announcements found."
        pagination={{ page, limit: 10, total, onPageChange: setPage }}
      />

      <Modal
        isOpen={isCreateModalOpen || !!editingAnnouncement}
        onClose={() => { setIsCreateModalOpen(false); setEditingAnnouncement(null); }}
        title={editingAnnouncement ? "Edit Announcement" : "Create Campus Announcement"}
      >
        <form onSubmit={handleSave}>
          {formError && (
            <div style={{ color: "var(--danger-text)", backgroundColor: "var(--danger-bg)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Announcement Title</label>
            <input
              type="text"
              required
              className="input-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Mid-Term Examination Schedule Released"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notice Details / Content</label>
            <textarea
              required
              className="input-control"
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter full notice content to display on the public campus portal..."
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              style={{ width: 18, height: 18, cursor: "pointer", accentColor: "var(--primary)" }}
            />
            <label htmlFor="published" style={{ fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
              Publish immediately on public homepage
            </label>
          </div>

          <div className="modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
            <button type="button" onClick={() => { setIsCreateModalOpen(false); setEditingAnnouncement(null); }} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAnnouncement ? "Save Changes" : "Publish Announcement"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Confirm Delete Announcement">
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Are you sure you want to delete this announcement?
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button onClick={() => setDeletingId(null)} className="btn btn-secondary">Cancel</button>
          <button onClick={() => deletingId && handleDelete(deletingId)} className="btn btn-danger">Delete</button>
        </div>
      </Modal>

      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
