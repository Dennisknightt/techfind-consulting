import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./hmg.css";
import { Header } from "@/components/hmg/Header";
import { Footer } from "@/components/hmg/Footer";
import { Motion } from "@/components/hmg/Motion";
import { SITE } from "@/lib/hmg/site";

const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap", axes: ["opsz"] });
const sans = Figtree({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "HMG Group Africa | Tax, Audit, Accounting & Advisory in Nairobi", template: "%s | HMG Group Africa" },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["tax advisory Nairobi", "KRA compliance", "audit Kenya", "bookkeeping Nairobi", "payroll Kenya", "financial advisory Africa", "eTIMS"],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_KE",
    title: "HMG Group Africa — Financial clarity. Confident growth.",
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: "HMG Group Africa — Financial clarity. Confident growth.", description: SITE.description },
  icons: { icon: [{ url: "/hmg/logo.svg", type: "image/svg+xml" }] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#062E4F", width: "device-width", initialScale: 1 };

export default function HmgRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="hmg">
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
