import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyMate — Turn Any YouTube Video Into a Quiz",
  description: "Paste a YouTube link, get a quiz instantly. Test what you actually learned, check your history, and track progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
