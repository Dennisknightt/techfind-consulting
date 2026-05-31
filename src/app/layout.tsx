import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechFind Consulting | AI Engine Optimization Agency",
  description:
    "TechFind Consulting helps businesses get discovered, understood, cited, and recommended by AI systems like ChatGPT, Gemini, Claude, Perplexity, and Google AI Overviews.",
  keywords:
    "AI Engine Optimization, AEO, AI visibility, ChatGPT optimization, Gemini optimization, AI search, business AI, Kenya, Africa",
  openGraph: {
    title: "TechFind Consulting | AI Engine Optimization Agency",
    description:
      "Get your business recommended by AI. We help brands rank across ChatGPT, Gemini, Claude, Perplexity, and Google AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-navy-950 text-white antialiased overflow-x-hidden">
        <SmoothScroll>
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
