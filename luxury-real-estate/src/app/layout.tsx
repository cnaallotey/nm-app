import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "Luxury Real Estate Listing UI",
  description: "Luxury Real Estate Listing UI by Nouvelle Maison",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
