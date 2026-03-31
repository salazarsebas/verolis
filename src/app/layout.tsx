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
  title: "Stellar x402 - Institutional Payments for AI",
  description: "Enable autonomous AI agents and institutions to make programmatic payments on Stellar with <5s settlement. Built with OpenZeppelin Relayer.",
  keywords: ["Stellar", "x402", "payments", "AI", "blockchain", "OpenZeppelin", "Soroban"],
  authors: [{ name: "Stellar x402 Team" }],
  openGraph: {
    title: "Stellar x402 - Institutional Payments for AI",
    description: "Next-generation payment infrastructure for institutions and AI agents",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
