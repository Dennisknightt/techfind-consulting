import type { Metadata } from "next";
import { Outfit, Geist, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

/** Outfit — hero display headlines (large, expressive) */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/** Geist — section headings, navbar, card titles, stats */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/** DM Sans — body copy, descriptions, buttons, labels */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
      className={`${outfit.variable} ${geist.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-foreground antialiased overflow-x-hidden">
        <ThemeProvider>
          <SmoothScroll>
            <CustomCursor />
            <ScrollProgress />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
