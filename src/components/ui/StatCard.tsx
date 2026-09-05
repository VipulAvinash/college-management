import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    text: string;
    positive?: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = "#eef2ff",
  iconColor = "#4f46e5",
  trend
}: StatCardProps) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>{title}</span>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "var(--radius-md)",
            backgroundColor: iconBgColor,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {subtitle}
          </div>
        )}
        {trend && (
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: trend.positive ? "var(--success-text)" : "var(--danger-text)",
              marginTop: "0.375rem"
            }}
          >
            {trend.text}
          </div>
        )}
      </div>
    </div>
  );
}
