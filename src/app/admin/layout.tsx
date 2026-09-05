import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <AdminSidebar admin={admin} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Bar Header */}
        <header
          style={{
            height: 64,
            backgroundColor: "#ffffff",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2rem",
            position: "sticky",
            top: 0,
            zIndex: 10
          }}
        >
          <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            College Administration Control Center
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--primary)",
                backgroundColor: "var(--primary-light)",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px"
              }}
            >
              Academic Session 2025-26
            </span>
          </div>
        </header>

        <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>{children}</div>
        </main>
      </div>
    </div>
  );
}
