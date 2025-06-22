import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pet Memories - AI Poster MVP",
  description: "Create beautiful AI-generated pet portrait posters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
