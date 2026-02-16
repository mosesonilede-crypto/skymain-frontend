import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import "@/lib/envValidation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://skymaintain.ai"),
  title: {
    default: "SkyMaintain - AI-Powered Aircraft Maintenance Platform",
    template: "%s | SkyMaintain",
  },
  description: "Regulatory-compliant aircraft maintenance intelligence. FAA/EASA certified workflows, predictive analytics, and audit-ready documentation for aviation maintenance operations.",
  keywords: ["aircraft maintenance", "aviation software", "FAA compliance", "EASA", "predictive maintenance", "fleet management", "MRO software"],
  authors: [{ name: "EncycloAMTS LLC" }],
  creator: "EncycloAMTS LLC",
  publisher: "SkyMaintain",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skymaintain.ai",
    siteName: "SkyMaintain",
    title: "SkyMaintain - AI-Powered Aircraft Maintenance Platform",
    description: "Regulatory-compliant aircraft maintenance intelligence. FAA/EASA certified workflows, predictive analytics, and audit-ready documentation.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "SkyMaintain - Aircraft Maintenance Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkyMaintain - AI-Powered Aircraft Maintenance Platform",
    description: "Regulatory-compliant aircraft maintenance intelligence for aviation operations.",
    images: ["/brand/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
