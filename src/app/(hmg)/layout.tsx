import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./hmg.css";
import { Header } from "@/components/hmg/Header";
import { Footer } from "@/components/hmg/Footer";
import { Motion } from "@/components/hmg/Motion";
import { ActionBar } from "@/components/hmg/ActionBar";
import { Analytics } from "@/components/hmg/Analytics";
import { SITE } from "@/lib/hmg/site";
import { OG_IMAGE } from "@/lib/hmg/meta";

const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap", axes: ["opsz"] });
const sans = Figtree({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "HMG Group Africa | Tax, Accounting, Audit & Advisory in Nairobi", template: "%s | HMG Group Africa" },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_KE",
    title: "HMG Group Africa — Financial clarity. Confident growth.",
    description: SITE.description,
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: "HMG Group Africa — Financial clarity. Confident growth.", description: SITE.description },
  icons: { icon: [{ url: "/hmg/brand/icon-32.png", sizes: "32x32", type: "image/png" }, { url: "/hmg/brand/icon-512.png", sizes: "512x512", type: "image/png" }], apple: [{ url: "/hmg/brand/apple-touch-icon.png", sizes: "180x180" }] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0A2A47", width: "device-width", initialScale: 1 };

export default function HmgRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables the short entrance animation only when JS runs; without JS everything renders static. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');try{if(localStorage.getItem('hmg-motion')==='paused')document.documentElement.classList.add('motion-paused')}catch(e){}" }} />
      </head>
      <body className="hmg">
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ActionBar />
        <Motion />
        <Analytics />
      </body>
    </html>
  );
}
