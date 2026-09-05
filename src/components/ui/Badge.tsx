import type { ReactNode } from "react";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  children: ReactNode;
  icon?: ReactNode;
}

export function Badge({ variant = "neutral", children, icon }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {icon && <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </span>
  );
}
