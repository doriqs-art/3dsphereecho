import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit Scene",
  description: "3D orbit scene — Echo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
