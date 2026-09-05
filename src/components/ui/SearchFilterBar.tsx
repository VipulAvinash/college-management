"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";

interface SearchFilterBarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  placeholder?: string;
  children?: ReactNode;
  actionButton?: ReactNode;
}

export function SearchFilterBar({
  searchQuery = "",
  onSearchChange,
  placeholder = "Search...",
  children,
  actionButton
}: SearchFilterBarProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        marginBottom: "1.25rem"
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", flex: 1 }}>
        {onSearchChange && (
          <div style={{ position: "relative", minWidth: 260, maxWidth: 380, flex: 1 }}>
            <Search
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
              type="text"
              className="input-control"
              style={{ paddingLeft: "2.5rem" }}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
            />
          </div>
        )}
        {children}
      </div>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
