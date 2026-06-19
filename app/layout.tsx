import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "International Sales Productivity Dashboard",
  description: "Internal global time and personal sales follow-up tools",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
