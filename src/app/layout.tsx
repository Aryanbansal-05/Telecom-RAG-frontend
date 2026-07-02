import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AERO-COMMS — Telecom RAN Assistant",
  description: "High-precision RAG interface for 5G/6G specifications and real-time network anomaly resolution. Engineering-grade analysis at the speed of thought.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={jetbrainsMono.variable}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="aero-theme">
          <div className="flex flex-col min-h-screen bg-[var(--bg)]">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
