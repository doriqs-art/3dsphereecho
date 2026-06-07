import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Echo — Orbit Scene",
  description: "Remember With",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Michroma&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
