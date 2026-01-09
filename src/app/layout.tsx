import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Quick Quality Assessment | UpskillABA",
  description:
    "Free 5-minute assessment for ABA agencies. Evaluate your quality practices across 28 research-backed questions and compare to industry benchmarks.",
  keywords:
    "ABA quality assessment, BCBA benchmarks, ABA provider evaluation, behavior analysis quality, treatment fidelity assessment",
  openGraph: {
    title: "Quick Quality Assessment | UpskillABA",
    description:
      "Free 5-minute assessment for ABA agencies. Evaluate your quality practices across 28 research-backed questions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
