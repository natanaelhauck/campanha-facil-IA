import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campanha Fácil IA",
  description:
    "Monte planos iniciais de campanha para Meta Ads, Instagram, Facebook e WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
