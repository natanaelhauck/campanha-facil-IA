import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campanha Fácil IA — Beta",
  description:
    "Organize um plano inicial orientativo para Meta Ads, Instagram, Facebook e WhatsApp.",
  applicationName: "Campanha Fácil IA",
  robots: {
    index: false,
    follow: false,
  },
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
