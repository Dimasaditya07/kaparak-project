import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",

  // INI YANG PENTING
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kaparak Outdoor",
  description: "Sewa peralatan outdoor terbaik",
  icons: {
    icon: "/images/kaparak.jpg",
    shortcut: "/images/kaparak.jpg",
    apple: "/images/kaparak.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        ${cormorant.variable}
        ${inter.variable}
        h-full
        antialiased
      `}
    >
      {/* GUNAKAN inter.className */}
      <body
        className={`
          ${inter.className}
          min-h-full
          flex
          flex-col
        `}
      >
        {children}

        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
