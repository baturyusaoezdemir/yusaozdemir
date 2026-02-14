import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yusa Özdemir – DevOps/Platform Engineer",
  description: "DevOps · Platform Engineering · CI/CD · Cloud · IaC · Observability",
  metadataBase: new URL("https://deinedomain.tld"),
  openGraph: {
    title: "Yusa Özdemir – Portfolio",
    description: "DevOps · Platform Engineering · CI/CD · Cloud · IaC · Observability",
    url: "/",
    siteName: "Yusa Özdemir",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "de_DE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
