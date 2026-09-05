import Link from "next/link";
import Image from "next/image";
import { announcementService } from "@/services/announcement.service";
import { dashboardService } from "@/services/dashboard.service";
import { Badge } from "@/components/ui/Badge";
import {
  GraduationCap,
  ArrowRight,
  Bell,
  Users,
  BookOpen,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Mail,
  Award,
  CreditCard,
  Lock,
  Compass,
  FileText
} from "lucide-react";

export default async function HomePage() {
  const publishedAnnouncements = await announcementService.listPublished();
  const stats = await dashboardService.getStats().catch(() => null);

  // Default fallback announcements matching Figma prototype
  const announcementsList = publishedAnnouncements.length > 0
    ? publishedAnnouncements
    : [
        {
          id: "1",
          title: "Fall Semester Mid-Term Examination Schedule Released",
          content: "All department timetables are uploaded for mid-term examination. Excellent student seating allocations and timetables are downloadable.",
          createdAt: new Date("2025-10-24"),
          category: "ACADEMICS",
          categoryColor: "info" as const,
          linkText: "Read Full Notice →"
        },
        {
          id: "2",
          title: "Annual Tech Symposium: HackSummit 2026 Registration Open",
          content: "Our largest tech festival begins next month! Join students from across the nation for 36 hours of creative building, design, and competitive coding.",
          createdAt: new Date("2025-10-20"),
          category: "CAMPUS LIFE",
          categoryColor: "success" as const,
          linkText: "Register Now →"
        },
        {
          id: "3",
          title: "Graduation Capstone Submission Guidelines & Deadlines",
          content: "Attention final-year students: all Capstone repository files and documentation must be updated inside the student record portal by November 15th.",
          createdAt: new Date("2025-10-18"),
          category: "ADMINISTRATION",
          categoryColor: "warning" as const,
          linkText: "Review Guidelines →"
        }
      ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
      {/* 1. Header Navigation Bar */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0.875rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {/* Logo & Branding */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)"
              }}
            >
              <GraduationCap size={24} />
            </div>
            <div>
              <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)", display: "block", lineHeight: 1.2 }}>
                Apex Institute of Technology
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
                Excellence in Higher Education
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <a href="#announcements" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Announcements
            </a>
            <a href="#departments" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Departments
            </a>
            <a href="#faculty" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Faculty Directory
            </a>
            <a href="#academics" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Academics
            </a>
          </nav>

          {/* Admin Login Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/login" className="btn btn-primary">
              <ShieldCheck size={16} /> Admin Portal Login
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #0b132b 0%, #1c2541 100%)",
          color: "#ffffff",
          padding: "5rem 1.5rem 7rem",
          position: "relative",
          textAlign: "center"
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 1rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(99, 102, 241, 0.18)",
                color: "#a5b4fc",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px solid rgba(99, 102, 241, 0.3)"
              }}
            >
              <CheckCircle2 size={14} /> Official Campus Information System
            </span>
          </div>

          <h1
            style={{
              fontSize: "3.25rem",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              marginBottom: "1.25rem",
              color: "#ffffff"
            }}
          >
            Empowering Education through Modern Management
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              color: "#94a3b8",
              lineHeight: 1.6,
              maxWidth: 720,
              margin: "0 auto 2.25rem"
            }}
          >
            Comprehensive portal for student records, department curricula, faculty directories, academic fee management, and campus announcements.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/login" className="btn btn-primary" style={{ padding: "0.75rem 1.75rem", fontSize: "0.9375rem" }}>
              Access Admin Portal <ArrowRight size={18} />
            </Link>
            <a href="#departments" className="btn btn-dark-glass" style={{ padding: "0.75rem 1.75rem", fontSize: "0.9375rem" }}>
              Explore Departments
            </a>
          </div>
        </div>
      </section>

      {/* 3. Floating Stats Bar (Overlapping Hero) */}
      <section style={{ maxWidth: 1180, width: "100%", margin: "-3rem auto 4.5rem", padding: "0 1.5rem", position: "relative", zIndex: 10 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            background: "#ffffff",
            borderRadius: "var(--radius-xl)",
            padding: "1.75rem 2rem",
            boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.12)",
            border: "1px solid var(--border-light)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 50, height: 50, borderRadius: "var(--radius-md)", backgroundColor: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
                {stats?.students.active ?? 10}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "0.25rem" }}>
                Active Students
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 50, height: 50, borderRadius: "var(--radius-md)", backgroundColor: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
                {stats?.faculty.active ?? 5}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "0.25rem" }}>
                Faculty Members
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 50, height: 50, borderRadius: "var(--radius-md)", backgroundColor: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
                {stats?.departments.total ?? 5}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "0.25rem" }}>
                Departments
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 50, height: 50, borderRadius: "var(--radius-md)", backgroundColor: "#fffbeb", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
                {stats?.courses.total ?? 6}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "0.25rem" }}>
                Offered Courses
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Campus Announcements Section */}
      <section id="announcements" style={{ maxWidth: 1240, width: "100%", margin: "0 auto 5rem", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <span className="category-pill" style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", marginBottom: "0.5rem" }}>
              WHAT'S HAPPENING
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Campus Announcements
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              The latest official notices, event updates, academic deadlines, and academic board decisions.
            </p>
          </div>
          <span className="badge badge-info" style={{ padding: "0.4rem 0.875rem", fontSize: "0.8125rem" }}>
            <Bell size={14} /> OFFICIAL FEED
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.75rem" }}>
          {announcementsList.slice(0, 3).map((a, idx) => {
            const categories = ["ACADEMICS", "CAMPUS LIFE", "ADMINISTRATION"];
            const colors = ["info", "success", "warning"] as const;
            const category = (a as any).category || categories[idx % 3];
            const variant = (a as any).categoryColor || colors[idx % 3];
            const dateStr = new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();

            return (
              <div key={a.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.25rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <Badge variant={variant}>{category}</Badge>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <Calendar size={13} /> {dateStr}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.35, marginBottom: "0.75rem" }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {a.content}
                  </p>
                </div>
                <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1rem", marginTop: "auto" }}>
                  <a href="#announcements" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                    {(a as any).linkText || "Read Full Notice →"}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Our Leading Departments Section */}
      <section id="departments" style={{ maxWidth: 1240, width: "100%", margin: "0 auto 5rem", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 2.5rem" }}>
          <span className="category-pill" style={{ backgroundColor: "#eef2ff", color: "#4f46e5", marginBottom: "0.5rem" }}>
            EXPLORE OUR BRANCHES
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Our Leading Departments
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
            Explore our state-of-the-art curricula, equipped labs, and academic opportunities across specialized disciplines.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.75rem" }}>
          {/* Card 1 */}
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ width: 46, height: 46, borderRadius: "var(--radius-md)", backgroundColor: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Computer Science & Engineering
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                Covering Artificial Intelligence, Systems Programming, Software Engineering, and advanced Algorithms frameworks.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                <span className="badge badge-neutral">AI & Machine Learning</span>
                <span className="badge badge-neutral">Software Systems</span>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
              <Link href="/login" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                Explore Curriculum <ExternalLink size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ width: 46, height: 46, borderRadius: "var(--radius-md)", backgroundColor: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Electronics & Communication
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                Focusing on Signal Processing, Embedded Systems, Semiconductor Design, and modern Wireless Communication networks.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                <span className="badge badge-neutral">VLSI & Microchips</span>
                <span className="badge badge-neutral">Wireless Comm</span>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
              <Link href="/login" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                Explore Curriculum <ExternalLink size={14} />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ width: 46, height: 46, borderRadius: "var(--radius-md)", backgroundColor: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Information Technology
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                Specialized in Cloud Computing, Cybersecurity, Enterprise Management Systems, and Web Technologies.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                <span className="badge badge-neutral">Cloud Architectures</span>
                <span className="badge badge-neutral">Cyber Security</span>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
              <Link href="/login" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                Explore Curriculum <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our Distinguished Faculty Section */}
      <section id="faculty" style={{ maxWidth: 1240, width: "100%", margin: "0 auto 5rem", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <span className="category-pill" style={{ backgroundColor: "#ecfdf5", color: "#047857", marginBottom: "0.5rem" }}>
              EXPERT EDUCATORS
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Our Distinguished Faculty
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Meet our world-class professors and researchers dedicated to guiding the next generation of tech leaders.
            </p>
          </div>
          <Link href="/login" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)" }}>
            View Full Directory →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
          {/* Faculty 1 */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", height: 240 }}>
              <Image
                src="/images/faculty/dr_emily_okonkwo.jpg"
                alt="Dr. Emily Okonkwo"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Dr. Emily Okonkwo
              </h3>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", marginTop: "0.125rem", marginBottom: "0.75rem" }}>
                Lead Dean & Professor / Dept. Chair
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
                Over 15 years of industry-leading experience in Computer Architecture and distributed systems.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                <Mail size={14} /> emily.okonkwo@college.com
              </div>
            </div>
          </div>

          {/* Faculty 2 */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", height: 240 }}>
              <Image
                src="/images/faculty/dr_michael_torres.jpg"
                alt="Dr. Michael Torres"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Dr. Michael Torres
              </h3>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", marginTop: "0.125rem", marginBottom: "0.75rem" }}>
                Professor, Cyber Systems
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
                Prominent cybersecurity researcher, renowned for his malware research and critical net systems.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                <Mail size={14} /> michael.torres@college.com
              </div>
            </div>
          </div>

          {/* Faculty 3 */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", height: 240 }}>
              <Image
                src="/images/faculty/dr_sarah_smith.jpg"
                alt="Dr. Sarah Smith"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Dr. Sarah Smith
              </h3>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", marginTop: "0.125rem", marginBottom: "0.75rem" }}>
                Associate Professor, Web Tech
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
                Specialist in cloud technologies, modern SaaS architectures, and full-stack platforms for complex student systems.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                <Mail size={14} /> sarah.smith@college.com
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. A Complete Portal Solution Section */}
      <section id="academics" style={{ maxWidth: 1240, width: "100%", margin: "0 auto 5rem", padding: "0 1.5rem" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #0b132b 0%, #1c2541 100%)",
            borderRadius: "var(--radius-xl)",
            padding: "4rem 2.5rem",
            color: "#ffffff",
            boxShadow: "0 25px 50px -12px rgba(11, 19, 43, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 3.5rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.3125rem 0.875rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                color: "#a5b4fc",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.75rem"
              }}
            >
              BUILT FOR EXCELLENCE
            </span>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
              A Complete Portal Solution
            </h2>
            <p style={{ fontSize: "1rem", color: "#94a3b8", marginTop: "0.5rem" }}>
              Secure and reliable workflows for university administrators, students, and educators.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {/* Feature 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CreditCard size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff" }}>
                Fee Management
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 }}>
                Streamlined accounting, tracking of outstanding tuition fees, semester bills, and online receipts.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", backgroundColor: "rgba(99, 102, 241, 0.2)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff" }}>
                Grade & Credit Records
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 }}>
                Official transcripts, semester grades, aggregate GPA projections, and digital transcript generation.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", backgroundColor: "rgba(5, 150, 105, 0.2)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff" }}>
                Admin Governance
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 }}>
                Fine-grained access control, role-based access logging, campus department coordination, and security audit records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer Section */}
      <footer style={{ backgroundColor: "#070a12", color: "#94a3b8", borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "4rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
            {/* Brand Col */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                  <GraduationCap size={20} />
                </div>
                <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "#ffffff" }}>Apex Institute</span>
              </div>
              <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, color: "#64748b" }}>
                Dedicated to educational excellence in engineering and computing disciplines, empowering graduate leaders with industry-ready skills.
              </p>
            </div>

            {/* Col 1 */}
            <div>
              <h4 style={{ fontSize: "0.75rem", fontWeight: 800, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
                NAVIGATION
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                <li><a href="#announcements" style={{ color: "#94a3b8" }}>Announcements</a></li>
                <li><a href="#departments" style={{ color: "#94a3b8" }}>Departments</a></li>
                <li><a href="#faculty" style={{ color: "#94a3b8" }}>Faculty Directory</a></li>
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <h4 style={{ fontSize: "0.75rem", fontWeight: 800, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
                PORTALS
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                <li><Link href="/login" style={{ color: "#94a3b8" }}>Admin Login</Link></li>
                <li><a href="#academics" style={{ color: "#94a3b8" }}>Student Desk</a></li>
                <li><a href="#academics" style={{ color: "#94a3b8" }}>Faculty Resource</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 style={{ fontSize: "0.75rem", fontWeight: 800, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
                CONTACT
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem", color: "#94a3b8" }}>
                <li>Email: contact@apex.edu</li>
                <li>Phone: +1 (800) 019-9020</li>
                <li>Campus: Block A4, Academic Square</li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.75rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem", fontSize: "0.8125rem", color: "#64748b" }}>
            <div>© {new Date().getFullYear()} Apex Institute of Technology. All rights reserved.</div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <a href="#" style={{ color: "#64748b" }}>Privacy Policy</a>
              <a href="#" style={{ color: "#64748b" }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
