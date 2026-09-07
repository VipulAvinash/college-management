import Link from "next/link";
import { announcementService } from "@/services/announcement.service";
import { dashboardService } from "@/services/dashboard.service";
import { Badge } from "@/components/ui/Badge";
import {
  Smile,
  Sparkles,
  Baby,
  Palette,
  Music,
  Heart,
  Sun,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  Bell,
  Calendar,
  MapPin,
  Phone,
  Clock,
  Users,
  CheckCircle2,
  Star,
  Compass,
  HeartHandshake
} from "lucide-react";

export default async function HomePage() {
  const publishedAnnouncements = await announcementService.listPublished().catch(() => []);
  const stats = await dashboardService.getStats().catch(() => null);

  const announcementsList = publishedAnnouncements.length > 0
    ? publishedAnnouncements
    : [
        {
          id: "1",
          title: "Annual Kindergarten Carnival & Puppet Show 🎪",
          content: "Join us this Saturday for a magical day filled with live puppet shows, face painting, organic snacks, and creative games for kids!",
          createdAt: new Date("2026-09-01"),
          category: "CARNIVAL",
          categoryColor: "success" as const,
          linkText: "View Event Schedule →"
        },
        {
          id: "2",
          title: "Admissions Open for Session 2025-26 🌟",
          content: "Enrolling for Playgroup, Nursery, Junior KG, and Daycare. Limited seats per batch to maintain a caring 1:8 caregiver-to-child ratio.",
          createdAt: new Date("2026-08-28"),
          category: "ADMISSION",
          categoryColor: "info" as const,
          linkText: "Apply Online Now →"
        },
        {
          id: "3",
          title: "Parent-Teacher Coffee & Progress Morning ☕",
          content: "Interactive coffee morning with our early childhood specialists to discuss toddler milestone development and sensory play habits.",
          createdAt: new Date("2026-08-20"),
          category: "MEET",
          categoryColor: "warning" as const,
          linkText: "RSVP Here →"
        }
      ];

  const programs = [
    {
      title: "Playgroup Explorers",
      age: "1.5 – 2.5 Years",
      icon: Baby,
      color: "#ff6b81",
      bgColor: "#fff0f3",
      description: "Sensory play, rhythm activities, social interaction, and motor skill development in a gentle, warm environment."
    },
    {
      title: "Nursery Learners",
      age: "2.5 – 3.5 Years",
      icon: Sparkles,
      color: "#f59e0b",
      bgColor: "#fffbeb",
      description: "Phonics awareness, color discovery, guided storytelling, and beginner Montessori hands-on learning modules."
    },
    {
      title: "Junior KG Innovators",
      age: "3.5 – 4.5 Years",
      icon: Palette,
      color: "#10b981",
      bgColor: "#ecfdf5",
      description: "Early math concepts, alphabet mastery, creative arts, drama play, and structured group cooperation."
    },
    {
      title: "Senior KG Scholars",
      age: "4.5 – 5.5 Years",
      icon: BookOpen,
      color: "#0ea5e9",
      bgColor: "#f0f9ff",
      description: "Primary school readiness, reading fluency, environmental science fun, and logical reasoning games."
    },
    {
      title: "Daycare & After-School",
      age: "1 – 8 Years",
      icon: Heart,
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
      description: "Nutritious warm meals, supervised nap zones, homework assistance, and evening outdoor play."
    }
  ];

  const pillars = [
    {
      title: "100% Live CCTV Monitored",
      desc: "Parents get secure mobile access to view their toddler's classroom activities and rest areas anytime.",
      icon: ShieldCheck
    },
    {
      title: "Play-Based Montessori Curriculum",
      desc: "Thoughtfully crafted play stations designed to spark curiosity, spatial awareness, and creative expression.",
      icon: Compass
    },
    {
      title: "Nutritious Meal Plans",
      desc: "Freshly prepared, organic, child-friendly snacks and warm lunches verified by pediatric nutritionists.",
      icon: Sun
    },
    {
      title: "Certified & Caring Staff",
      desc: "Experienced early childhood educators trained in pediatric CPR, child psychology, and warm mentorship.",
      icon: HeartHandshake
    }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      {/* 1. Header Navigation Bar */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "2px solid #fce7f3",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 4px 20px rgba(74, 44, 17, 0.05)"
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
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 6px 16px rgba(245, 158, 11, 0.35)"
              }}
            >
              <Smile size={28} />
            </div>
            <div>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", display: "block", lineHeight: 1.1 }}>
                Chocolate Kids
              </span>
              <span style={{ fontSize: "0.75rem", color: "#d97706", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Play School & Daycare
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <a href="#programs" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Play Programs
            </a>
            <a href="#pillars" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Why Us
            </a>
            <a href="#notices" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>
              School News
            </a>
            <a href="#contact" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Campus Tour
            </a>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <Link href="/login" className="btn btn-secondary btn-sm" style={{ border: "2px solid #fde68a" }}>
              Parent & Staff Login
            </Link>
            <a href="#contact" className="btn btn-amber btn-sm">
              ✨ Schedule a Tour
            </a>
          </div>
        </div>
      </header>

      {/* 2. Playful Hero Banner */}
      <section
        style={{
          background: "radial-gradient(circle at top center, #3d2310 0%, #251206 100%)",
          color: "#ffffff",
          padding: "5.5rem 1.5rem 6.5rem",
          position: "relative",
          textAlign: "center",
          overflow: "hidden"
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 1.2rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(245, 158, 11, 0.2)",
                color: "#fcd34d",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.02em"
              }}
            >
              <Sparkles size={16} /> Admissions Open For Session 2025–26
            </span>
          </div>

          <h1
            style={{
              fontSize: "3.2rem",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              lineHeight: 1.15,
              marginBottom: "1.25rem",
              letterSpacing: "-0.01em",
              color: "#ffffff"
            }}
          >
            Where Curiosity & Joy Begin Their Journey! 🍫🎈
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "#f3e8df",
              lineHeight: 1.6,
              maxWidth: 720,
              margin: "0 auto 2.5rem"
            }}
          >
            Welcome to <strong>Chocolate Kids Play School</strong> — a magical early learning environment where toddlers explore, create, sing, and grow with loving, certified caregivers.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#contact" className="btn btn-amber" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
              <Smile size={20} /> Enroll Your Toddler Today
            </a>
            <a href="#programs" className="btn btn-dark-glass" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
              <BookOpen size={20} /> Explore Play Programs
            </a>
          </div>

          {/* Quick Metrics Banner */}
          <div
            style={{
              marginTop: "4rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              borderRadius: "var(--radius-xl)",
              padding: "1.75rem 2rem",
              border: "1px solid rgba(255, 255, 255, 0.15)"
            }}
          >
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fcd34d", fontFamily: "var(--font-display)" }}>
                {stats?.students?.total || 250}+
              </div>
              <div style={{ fontSize: "0.875rem", color: "#f3e8df", fontWeight: 600 }}>Happy Toddlers Enrolled</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ff85a1", fontFamily: "var(--font-display)" }}>
                {stats?.faculty?.total || 18}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#f3e8df", fontWeight: 600 }}>Certified Caregivers</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#34d399", fontFamily: "var(--font-display)" }}>
                {stats?.departments?.total || 5}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#f3e8df", fontWeight: 600 }}>Play Age Programs</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#38bdf8", fontFamily: "var(--font-display)" }}>
                1 : 8
              </div>
              <div style={{ fontSize: "0.875rem", color: "#f3e8df", fontWeight: 600 }}>Teacher-Child Ratio</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Play Programs Section */}
      <section id="programs" style={{ padding: "5rem 1.5rem", maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{ color: "#d97706", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.8125rem", textTransform: "uppercase" }}>
            Tailored Early Development
          </span>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginTop: "0.375rem" }}>
            Our Play Programs & Age Groups 🧸
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 600, margin: "0.5rem auto 0" }}>
            Structured around play-based exploration, sensory discovery, and joyful early learning milestones.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {programs.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderColor: "#fce7f3",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "var(--radius-md)",
                      backgroundColor: p.bgColor,
                      color: p.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
                    }}
                  >
                    <Icon size={26} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: p.color,
                      backgroundColor: p.bgColor,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px"
                    }}
                  >
                    {p.age}
                  </span>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginTop: "0.75rem" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.5 }}>
                    {p.description}
                  </p>
                </div>
                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-light)" }}>
                  <a href="#contact" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    Learn More <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Why Choose Us / Pillars */}
      <section id="pillars" style={{ backgroundColor: "#fefcf9", padding: "5rem 1.5rem", borderTop: "1px solid #f3e8df", borderBottom: "1px solid #f3e8df" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ color: "#d97706", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.8125rem", textTransform: "uppercase" }}>
              Parent Peace of Mind
            </span>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginTop: "0.375rem" }}>
              Why Families Love Chocolate Kids 💛
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 640, margin: "0.5rem auto 0" }}>
              We combine maximum safety, warm affection, and modern early childhood learning techniques.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "2rem",
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid #fde68a",
                    boxShadow: "0 8px 24px rgba(74, 44, 17, 0.05)"
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "#fef3c7",
                      color: "#d97706",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem"
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. School News & Notice Board */}
      <section id="notices" style={{ padding: "5rem 1.5rem", maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ color: "#d97706", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.8125rem", textTransform: "uppercase" }}>
              School Updates & Notices
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginTop: "0.25rem" }}>
              Recent News & Events 📢
            </h2>
          </div>
          <Link href="/login" className="btn btn-secondary btn-sm">
            View Parent Portal Notices →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {announcementsList.map((ann) => (
            <div key={ann.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderColor: "#fde68a" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span className="badge badge-warning">
                    {"category" in ann ? (ann as { category: string }).category : "NOTICE"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Calendar size={13} /> {new Date(ann.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
                  {ann.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {ann.content}
                </p>
              </div>
              <div style={{ marginTop: "1.25rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#d97706" }}>
                  {"linkText" in ann ? (ann as { linkText: string }).linkText : "Read Full Notice →"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Campus Tour & Inquiry Section */}
      <section id="contact" style={{ backgroundColor: "#2c1808", color: "#ffffff", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <span style={{ color: "#fcd34d", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.8125rem", textTransform: "uppercase" }}>
              Schedule A Campus Visit
            </span>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, fontFamily: "var(--font-display)", marginTop: "0.375rem", lineHeight: 1.2 }}>
              Come See the Joyful Learning in Person! 🎈
            </h2>
            <p style={{ color: "#f3e8df", fontSize: "1rem", marginTop: "1rem", lineHeight: 1.6 }}>
              We invite parents to walk through our colorful play zones, meet our warm early childhood teachers, and experience our secure play infrastructure.
            </p>

            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(245, 158, 11, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fcd34d" }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", color: "#a38c7b" }}>Campus Location</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff" }}>124 Sunshine Lane, Playtown Center</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(245, 158, 11, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fcd34d" }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", color: "#a38c7b" }}>Admissions Helpline</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff" }}>+1 (800) 555-KIDS / +1 (800) 555-5437</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(245, 158, 11, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fcd34d" }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", color: "#a38c7b" }}>School Hours</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff" }}>Mon – Fri: 8:00 AM – 6:30 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Card */}
          <div style={{ backgroundColor: "#ffffff", color: "var(--text-primary)", padding: "2.25rem", borderRadius: "var(--radius-xl)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
              Request Tour & Callback 📞
            </h3>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              Fill in your details and our admission counselor will call you within 2 hours.
            </p>

            <form action="/#contact" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Parent&apos;s Full Name</label>
                <input type="text" className="input-control" placeholder="e.g. Eleanor Vance" required />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input type="tel" className="input-control" placeholder="+1 (555) 000-0000" required />
              </div>
              <div>
                <label className="form-label">Child&apos;s Age / Interested Program</label>
                <select className="input-control">
                  <option>Playgroup (1.5 - 2.5 yrs)</option>
                  <option>Nursery (2.5 - 3.5 yrs)</option>
                  <option>Junior KG (3.5 - 4.5 yrs)</option>
                  <option>Senior KG (4.5 - 5.5 yrs)</option>
                  <option>Day Care & After School</option>
                </select>
              </div>
              <button type="submit" className="btn btn-amber" style={{ width: "100%", marginTop: "0.5rem" }}>
                Submit Tour Inquiry ✨
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer style={{ backgroundColor: "#1d0e04", color: "#a38c7b", padding: "3rem 1.5rem 2rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
              <Smile size={20} />
            </div>
            <div>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff", fontFamily: "var(--font-display)" }}>
                Chocolate Kids Play School
              </span>
              <span style={{ fontSize: "0.75rem", color: "#a38c7b", display: "block" }}>
                © 2026 Chocolate Kids Inc. All rights reserved.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
            <Link href="/login" style={{ color: "#fcd34d", fontWeight: 600 }}>
              Staff & Admin Portal
            </Link>
            <a href="#programs" style={{ color: "#a38c7b" }}>Programs</a>
            <a href="#pillars" style={{ color: "#a38c7b" }}>Safety & CCTV</a>
            <a href="#notices" style={{ color: "#a38c7b" }}>Notices</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
