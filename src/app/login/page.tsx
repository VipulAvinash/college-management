"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Smile, Mail, Lock, LogIn, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@college.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top left, #3d2310 0%, #211005 100%)",
        padding: "1.5rem",
        position: "relative"
      }}
    >
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          color: "#fcd34d",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: 700,
          textDecoration: "none"
        }}
      >
        <ArrowLeft size={18} /> Back to Chocolate Kids Home
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(16px)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          border: "2px solid #fde68a",
          overflow: "hidden"
        }}
      >
        {/* Card Header */}
        <div style={{ padding: "2.5rem 2.5rem 1.5rem", textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 1.25rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 8px 20px rgba(245, 158, 11, 0.4)"
            }}
          >
            <Smile size={36} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
            Chocolate Kids Login
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Parent & Administrator Management Portal
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "0 2.5rem 2.5rem" }}>
          {error && (
            <div
              style={{
                backgroundColor: "var(--danger-bg)",
                color: "var(--danger-text)",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-md)",
                padding: "0.75rem 1rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1.25rem"
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)"
                }}
              />
              <input
                type="email"
                required
                className="input-control"
                style={{ paddingLeft: "2.5rem" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@college.com"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)"
                }}
              />
              <input
                type="password"
                required
                className="input-control"
                style={{ paddingLeft: "2.5rem" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.75rem", fontSize: "0.9375rem" }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
