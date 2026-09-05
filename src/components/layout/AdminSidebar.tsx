"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  CreditCard,
  Receipt,
  Megaphone,
  LogOut,
  ShieldCheck
} from "lucide-react";
import type { PublicUser } from "@/db/schema";

interface AdminSidebarProps {
  admin: PublicUser;
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Faculty", href: "/admin/faculty", icon: GraduationCap },
  { label: "Departments", href: "/admin/departments", icon: Building2 },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Fees", href: "/admin/fees", icon: CreditCard },
  { label: "Payments", href: "/admin/payments", icon: Receipt },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone }
];

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <aside
      style={{
        width: 260,
        backgroundColor: "var(--bg-sidebar)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        position: "sticky",
        top: 0,
        height: "100vh"
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "1.5rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
          }}
        >
          <GraduationCap size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.01em" }}>
            CMS Portal
          </h1>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>College Admin</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: "1.25rem 0.875rem", display: "flex", flexDirection: "column", gap: "0.25rem", overflowY: "auto" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 0.75rem 0.5rem" }}>
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.875rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#ffffff" : "#94a3b8",
                backgroundColor: isActive ? "var(--primary)" : "transparent",
                transition: "all 0.2s ease"
              }}
            >
              <Icon size={18} color={isActive ? "#ffffff" : "#94a3b8"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "rgba(15, 23, 42, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              color: "#818cf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
              {admin.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
              {admin.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Sign Out"
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            padding: "0.375rem",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center"
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
