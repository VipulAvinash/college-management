"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  const bg = type === "success" ? "var(--success-bg)" : type === "error" ? "var(--danger-bg)" : "var(--info-bg)";
  const color = type === "success" ? "var(--success-text)" : type === "error" ? "var(--danger-text)" : "var(--info-text)";
  const border = type === "success" ? "#a7f3d0" : type === "error" ? "#fecaca" : "#bfdbfe";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 200,
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        borderRadius: "var(--radius-md)",
        padding: "0.875rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        boxShadow: "var(--shadow-lg)",
        animation: "slideUp 0.3s ease-out forwards"
      }}
    >
      {type === "success" && <CheckCircle2 size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      {type === "info" && <Info size={18} />}
      <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", marginLeft: "0.5rem" }}>
        <X size={16} />
      </button>
    </div>
  );
}
