import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixie Webs — Business Management Platform",
  description: "Premium CRM & ERP system for digital agencies. Manage clients, projects, invoices, expenses, and analytics in one place.",
  keywords: ["agency management", "CRM", "ERP", "invoicing", "project management", "digital agency"],
  openGraph: {
    title: "Pixie Webs",
    description: "Premium Business Management for Digital Agencies",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
