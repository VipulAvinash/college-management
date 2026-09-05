import Link from "next/link";
import { dashboardService } from "@/services/dashboard.service";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  DollarSign,
  UserPlus,
  Receipt,
  Megaphone,
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await dashboardService.getStats();

  const totalFeeBilled = stats.fees.total || 1;
  const paidPercentage = Math.round((stats.fees.paid / totalFeeBilled) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Admin Control Dashboard
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Real-time operational summary of students, faculty, academic fees, and department metrics.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/admin/students" className="btn btn-primary btn-sm">
            <UserPlus size={16} /> New Student
          </Link>
          <Link href="/admin/payments" className="btn btn-secondary btn-sm">
            <Receipt size={16} /> Record Payment
          </Link>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
        <StatCard
          title="Total Students"
          value={stats.students.total}
          subtitle={`${stats.students.active} Currently Active`}
          icon={<Users size={22} />}
          iconBgColor="#eef2ff"
          iconColor="#4f46e5"
        />
        <StatCard
          title="Faculty Members"
          value={stats.faculty.total}
          subtitle={`${stats.faculty.active} Active Teaching Staff`}
          icon={<GraduationCap size={22} />}
          iconBgColor="#ecfdf5"
          iconColor="#059669"
        />
        <StatCard
          title="Departments"
          value={stats.departments.total}
          subtitle="Academic Branches"
          icon={<Building2 size={22} />}
          iconBgColor="#eff6ff"
          iconColor="#2563eb"
        />
        <StatCard
          title="Courses Offered"
          value={stats.courses.total}
          subtitle="Degree Programs"
          icon={<BookOpen size={22} />}
          iconBgColor="#fffbeb"
          iconColor="#d97706"
        />
      </div>

      {/* Financial Overview Card */}
      <div className="card" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Financial Summary
            </span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
              Academic Fee Collection Status
            </h2>
          </div>
          <Link href="/admin/fees" className="btn btn-secondary btn-sm">
            View Fee Records <ArrowRight size={14} />
          </Link>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            <span>Collection Rate ({paidPercentage}%)</span>
            <span>₹{stats.fees.paid.toLocaleString()} of ₹{stats.fees.total.toLocaleString()}</span>
          </div>
          <div style={{ height: 10, width: "100%", backgroundColor: "#e2e8f0", borderRadius: 9999, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.min(paidPercentage, 100)}%`,
                background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                borderRadius: 9999,
                transition: "width 0.6s ease"
              }}
            />
          </div>
        </div>

        {/* Financial Sub-metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL BILLED</div>
            <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.25rem" }}>
              ₹{stats.fees.total.toLocaleString()}
            </div>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "#ecfdf5", borderRadius: "var(--radius-md)", border: "1px solid #a7f3d0" }}>
            <div style={{ fontSize: "0.75rem", color: "#047857", fontWeight: 600 }}>TOTAL PAID</div>
            <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "#047857", marginTop: "0.25rem" }}>
              ₹{stats.fees.paid.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#059669", marginTop: "0.25rem" }}>
              {stats.fees.paidCount} Records Cleared
            </div>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "#fffbeb", borderRadius: "var(--radius-md)", border: "1px solid #fde68a" }}>
            <div style={{ fontSize: "0.75rem", color: "#b45309", fontWeight: 600 }}>PENDING BALANCE</div>
            <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "#b45309", marginTop: "0.25rem" }}>
              ₹{stats.fees.pending.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#d97706", marginTop: "0.25rem" }}>
              {stats.fees.pendingCount} Pending Accounts
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Recent Activity Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1.5rem" }}>
        {/* Recent Students */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Recent Student Enrolments
            </h3>
            <Link href="/admin/students" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--primary)" }}>
              View All →
            </Link>
          </div>
          {stats.recent.students.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No recent students</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {stats.recent.students.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    backgroundColor: "#f8fafc",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-light)"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {s.firstName} {s.lastName}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {s.studentId} • {s.email}
                    </div>
                  </div>
                  <Badge variant={s.status === "ACTIVE" ? "success" : "neutral"}>
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Recent Fee Payments
            </h3>
            <Link href="/admin/payments" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--primary)" }}>
              View All →
            </Link>
          </div>
          {stats.recent.payments.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No recent payments</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {stats.recent.payments.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    backgroundColor: "#f8fafc",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-light)"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      ₹{Number(p.amount).toLocaleString()}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Method: {p.paymentMethod} • Ref: {p.transactionReference || "N/A"}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
