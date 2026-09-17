import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./preloader.css";
import "./almanac.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wedding-invitation-webapp.vercel.app";

export const viewport: Viewport = {
  themeColor: "#120208",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Thushara & Wadusha — Wedding Invitation",
  description:
    "The Wedding Celebration of Thushara & Wadusha. Thursday, 26 November 2026 at Hotel Green Court, Homagama.",
  openGraph: {
    title: "Thushara & Wadusha — Wedding Invitation",
    description:
      "We warmly invite you to celebrate our wedding day with us. Thursday, 26 November 2026 at Hotel Green Court, Homagama.",
    siteName: "Thushara & Wadusha Wedding Invitation",
    images: [
      {
        url: "/photos/moments/photo-1.webp",
        width: 1086,
        height: 1448,
        alt: "The Wedding of Thushara & Wadusha",
      },
      {
        url: "/photos/moments/photo-3.webp",
        width: 1448,
        height: 1086,
        alt: "Thushara & Wadusha — Golden Sunsets With You",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thushara & Wadusha — Wedding Invitation",
    description:
      "The Wedding Celebration of Thushara & Wadusha. Thursday, 26 November 2026 at Hotel Green Court, Homagama.",
    images: ["/photos/moments/photo-1.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}