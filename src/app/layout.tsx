import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOAP Code Generator",
  description: "Create Javascript code from SOAP XML in a blink of an eye",
  openGraph: {
    title: "SOAP Code Generator",
    description:
      "Convert SOAP XML requests and responses into JavaScript code instantly.",
    url: "https://soaptojs.vercel.app",
    siteName: "SOAP Code Generator",
    images: [
      {
        url: "https://soaptojs.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "SOAP Code Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SOAP Code Generator",
    description:
      "Convert SOAP XML requests and responses into JavaScript code instantly.",
    images: ["https://soaptojs.vercel.app/og-image.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
