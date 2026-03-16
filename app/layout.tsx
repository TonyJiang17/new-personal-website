import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tony Jiang",
  description: "Product Manager & AI Product Builder — Tony Jiang's personal site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
