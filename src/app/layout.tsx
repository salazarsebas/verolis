import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verolis | Institutional x402 on Stellar",
  description:
    "Verolis packages institutional payment intelligence, compliance workflows, and tokenized-asset access into request-priced x402 APIs on Stellar.",
  keywords: ["Verolis", "Stellar", "x402", "institutional payments", "Soroban", "OpenZeppelin", "stablecoins"],
  authors: [{ name: "Verolis" }],
  openGraph: {
    title: "Verolis | Institutional x402 on Stellar",
    description: "Commercialize institutional payment intelligence and settlement workflows with x402 on Stellar.",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
