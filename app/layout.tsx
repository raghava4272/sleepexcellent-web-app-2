import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SleepExcellent",
  description: "SleepExcellent ecommerce storefront",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
