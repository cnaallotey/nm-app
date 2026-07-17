import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const title = "Vloid — Let AI make your follow-up calls";
const description =
  "Vloid calls your customer list, asks what you need to know, and hands you structured results back — no agents dialing one by one. Join the early-access waitlist.";

export const metadata: Metadata = {
  metadataBase: new URL("https://vloid.clientra.tech"),
  title,
  description,
  keywords: [
    "AI voice agent",
    "outbound calling",
    "customer follow-up",
    "renewal reminders",
    "feedback collection",
    "call automation",
  ],
  openGraph: {
    title,
    description,
    url: "https://vloid.clientra.tech",
    siteName: "Vloid",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
