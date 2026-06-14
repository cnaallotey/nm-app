import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./_components/providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskBoard",
  description:
    "Post a task, apply for one, or nominate someone. A hybrid community & freelance task board.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning: next-themes will set `class="dark"` on <html>
  // client-side in a later phase; this avoids the hydration mismatch warning.
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <body className="min-h-dvh flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
