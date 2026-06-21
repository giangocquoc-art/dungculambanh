import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mindloop — Get Inspired with Us",
  description:
    "Mindloop is a newsletter and content platform where curiosity meets clarity. Join 7,000+ readers for meaningful updates, news around technology, and a shared journey toward depth and direction.",
  keywords: [
    "Mindloop",
    "newsletter",
    "content platform",
    "technology",
    "writing",
    "community",
  ],
  authors: [{ name: "Mindloop" }],
  openGraph: {
    title: "Mindloop — Get Inspired with Us",
    description:
      "A newsletter and content platform where curiosity meets clarity. Join 7,000+ readers.",
    siteName: "Mindloop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindloop — Get Inspired with Us",
    description:
      "A newsletter and content platform where curiosity meets clarity.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
