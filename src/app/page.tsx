import Link from "next/link";
import { announcementService } from "@/services/announcement.service";
import { dashboardService } from "@/services/dashboard.service";
import { GraduationCap, ArrowRight, Bell, Users, BookOpen, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default async function HomePage() {
  const announcements = await announcementService.listPublished();
  const stats = await dashboardService.getStats().catch(() => null);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
      {/* Navigation Header */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 50
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff"
              }}
            >
              <GraduationCap size={24} />
            </div>
            <div>
              <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Apex Institute of Technology
              </span>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Excellence in Higher Education
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/login" className="btn btn-primary">
              <ShieldCheck size={16} /> Admin Portal Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          color: "#ffffff",
          padding: "4rem 1.5rem 5rem",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 720 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.375rem 0.875rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                color: "#a5b4fc",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "1.25rem",
                border: "1px solid rgba(99, 102, 241, 0.3)"
              }}
            >
              <CheckCircle2 size={14} /> Official Campus Information System
            </span>
            <h1 style={{ fontSize: "2.75rem", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              Empowering Education through Modern Management
            </h1>
            <p style={{ fontSize: "1.125rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "2rem" }}>
              Comprehensive portal for student records, department curricula, faculty directories, academic fee management, and campus announcements.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/login" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem", fontSize: "1rem" }}>
                Access Admin Portal <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      {stats && (
        <section style={{ maxWidth: 1200, width: "100%", margin: "-2.5rem auto 3rem", padding: "0 1.5rem", position: "relative", zIndex: 10 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
              background: "#ffffff",
              borderRadius: "var(--radius-xl)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border-light)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", backgroundColor: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stats.students.active}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Active Students</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", backgroundColor: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GraduationCap size={24} />
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stats.faculty.active}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Faculty Members</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", backgroundColor: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stats.departments.total}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Departments</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", backgroundColor: "#fffbeb", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BookOpen size={24} />
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stats.courses.total}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Offered Courses</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Announcements Feed Section */}
      <section style={{ maxWidth: 1200, width: "100%", margin: "0 auto 4rem", padding: "0 1.5rem", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>
              Campus Announcements
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              Latest notices, deadlines, and official campus news
            </p>
          </div>
          <span className="badge badge-info" style={{ padding: "0.375rem 0.75rem", fontSize: "0.8125rem" }}>
            <Bell size={14} /> Official Feed
          </span>
        </div>

        {announcements.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            No public announcements available at this time.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {announcements.map((a) => (
              <div key={a.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span className="badge badge-success">Published</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {new Date(a.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {a.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Apex Institute of Technology. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            <Link href="/login">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
