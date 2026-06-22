import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/sections/shared/Navbar";
import Footer from "@/components/sections/shared/Footer";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Virya Energy — Fit For Purpose Energy",
  description:
    "Virya Energy develops, finances, constructs, and operates sustainable energy assets — wind, solar, hydrogen and supply — across 15+ countries.",
  metadataBase: new URL("https://virya-energy.com"),
  openGraph: {
    title: "Virya Energy — Fit For Purpose Energy",
    description:
      "We develop sustainable energy solutions across 15+ countries: wind, solar, hydrogen, supply.",
    url: "https://virya-energy.com/en/",
    siteName: "Virya Energy",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-screen bg-white text-ink antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
