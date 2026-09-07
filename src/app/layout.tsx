import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Chocolate Kids Play School | Early Childhood Education & Preschool",
  description: "Nurturing young minds through play, exploration, and structured early childhood development."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

