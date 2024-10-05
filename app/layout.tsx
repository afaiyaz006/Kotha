import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Bree_Serif } from "next/font/google";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const breeSerif = Bree_Serif({
  subsets: ["latin-ext"],
  weight: "400",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Kotha-Chat",
  description: "Lightweight chat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${breeSerif.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
