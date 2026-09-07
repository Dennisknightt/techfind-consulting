import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Techfind",
  description: "Your business. In control.",
  applicationName: "Techfind",
  manifest: "/os-manifest.webmanifest",
  robots: "noindex,nofollow",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Techfind",
  },
  icons: {
    icon: [
      { url: "/os-icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/os-icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/os-icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F3EC" },
    { media: "(prefers-color-scheme: dark)", color: "#17140F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  // The mobile keyboard resizes the actual layout viewport instead of just
  // overlaying it — fixed-position footers (Sheet/Dialog save buttons, the
  // bottom nav) stay above the keyboard instead of hiding behind it.
  interactiveWidget: "resizes-content",
};

export default function OsRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="techfind-os-theme">
          <MotionConfig reducedMotion="user">
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  borderRadius: "var(--radius-lg)",
                },
              }}
            />
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
