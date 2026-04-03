import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fimex Capital — Panel Administrativo",
  description: "Sistema interno de gestión — SOFOM E.N.R.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
