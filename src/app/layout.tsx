import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "College Management System",
  description: "Admin-managed college information system"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

