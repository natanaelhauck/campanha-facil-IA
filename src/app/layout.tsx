import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campanha Facil IA",
  description: "Monte planos de campanha para Meta Ads, Instagram, Facebook e WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
