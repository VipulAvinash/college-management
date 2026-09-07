import Link from "next/link";
import { dashboardService } from "@/services/dashboard.service";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import {
  Baby,
  HeartHandshake,
  Sparkles,
  Palette,
  UserPlus,
  Receipt,
  ArrowRight,
  Smile,
  ShieldCheck
} from "lucide-react";

const defaultStats = {
  students: { total: 0, active: 0 },
  faculty: { total: 0, active: 0 },
  departments: { total: 0 },
  courses: { total: 0 },
  fees: {
    total: 0,
    paid: 0,
    pending: 0,
    pendingCount: 0,
    overdueCount: 0,
    paidCount: 0
  },
  recent: {
    students: [],
    payments: [],
    announcements: []
  }
};

export default async function AdminDashboardPage() {
  const stats = await dashboardService.getStats().catch(() => defaultStats);

  const totalFeeBilled = stats.fees.total || 1;
  const paidPercentage = Math.round((stats.fees.paid / totalFeeBilled) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
            Chocolate Kids Control Dashboard 🎈
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Real-time overview of enrolled toddlers, caregivers, play programs, and tuition fee collection.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/admin/students" className="btn btn-amber btn-sm">
            <UserPlus size={16} /> Enroll New Toddler
          </Link>
          <Link href="/admin/payments" className="btn btn-secondary btn-sm">
            <Receipt size={16} /> Record Fee Payment
          </Link>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
        <StatCard
          title="Enrolled Toddlers"
          value={stats.students.total}
          subtitle={`${stats.students.active} Currently Active`}
          icon={<Baby size={22} />}
          iconBgColor="#fff0f3"
          iconColor="#ff6b81"
        />
        <StatCard
          title="Caregivers & Teachers"
          value={stats.faculty.total}
          subtitle={`${stats.faculty.active} Active Teaching Staff`}
          icon={<HeartHandshake size={22} />}
          iconBgColor="#ecfdf5"
          iconColor="#10b981"
        />
        <StatCard
          title="Play Programs"
          value={stats.departments.total}
          subtitle="Age Group Batches"
          icon={<Sparkles size={22} />}
          iconBgColor="#fffbeb"
          iconColor="#f59e0b"
        />
        <StatCard
          title="Activity Modules"
          value={stats.courses.total}
          subtitle="Co-curricular Subjects"
          icon={<Palette size={22} />}
          iconBgColor="#f0f9ff"
          iconColor="#0ea5e9"
        />
      </div>

      {/* Financial Overview Card */}
      <div className="card" style={{ background: "linear-gradient(135deg, #ffffff 0%, #fffdfa 100%)", borderColor: "#fde68a" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Fee Collection Status
            </span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              Tuition & Daycare Billing Overview
            </h2>
          </div>
          <Link href="/admin/fees" className="btn btn-secondary btn-sm">
            View All Fee Plans <ArrowRight size={14} />
          </Link>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            <span>Collection Rate ({paidPercentage}%)</span>
            <span>₹{stats.fees.paid.toLocaleString()} of ₹{stats.fees.total.toLocaleString()}</span>
          </div>
          <div style={{ height: 12, width: "100%", backgroundColor: "#fef3c7", borderRadius: 9999, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.min(paidPercentage, 100)}%`,
                background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
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
              {stats.fees.paidCount} Receipts Cleared
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
            <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Recent Toddler Admissions 🧸
            </h3>
            <Link href="/admin/students" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#d97706" }}>
              View All Kids →
            </Link>
          </div>
          {stats.recent.students.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No recent admissions recorded</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {stats.recent.students.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    backgroundColor: "#fffdfa",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid #fde68a"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {s.firstName} {s.lastName}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Admission ID: {s.studentId} • Parent: {s.email}
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
            <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Recent Fee Receipts 💳
            </h3>
            <Link href="/admin/payments" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#d97706" }}>
              View Receipts →
            </Link>
          </div>
          {stats.recent.payments.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No payment receipts logged yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {stats.recent.payments.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    backgroundColor: "#fffdfa",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid #fde68a"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      ₹{Number(p.amount).toLocaleString()}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Mode: {p.paymentMethod} • Ref: {p.transactionReference || "N/A"}
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
