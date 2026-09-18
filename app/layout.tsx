import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { FloatingActions } from "@/components/contact/floating-actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "SleepExcellent",
  description: "SleepExcellent mattress and interiors storefront",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body><Suspense fallback={null}><Header /></Suspense>{children}<FloatingActions /></body>
    </html>
  );
}
