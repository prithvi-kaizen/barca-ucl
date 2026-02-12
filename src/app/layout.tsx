import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Barça UCL Winning Campaigns",
  description:
    "Analytical dashboard studying FC Barcelona's five UEFA Champions League winning seasons",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <Navigation />
        <main
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "2rem 1.5rem 4rem",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            borderTop: "1px solid var(--color-border)",
            padding: "1.5rem",
            textAlign: "center",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          Barça UCL Winning Campaigns · Data sourced from UEFA.com, FBref, Wikipedia
        </footer>
      </body>
    </html>
  );
}
