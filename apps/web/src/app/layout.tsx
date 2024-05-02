import "./globals.css";

import localFont from "next/font/local";
import type { Metadata } from "next/types";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: {
    default: "테슬라 정보를 한 곳에서 | play-tesla",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "테슬라 모델 Y",
    "테슬라 모델 3",
    "테슬라 모델 S",
    "테슬라 모델 X",
    "테슬라 모델 Y 가격",
    "테슬라 모델 3 가격",
    "테슬라 모델 S 가격",
    "테슬라 모델 X 가격",
    "테슬라 보조금",
    "테슬라 할인",
    "테슬라 가격",
    "전기차",
    "전기차 가격",
    "전기차 보조금",
  ],
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.links.blog,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@alwaysfun2183",
  },
  icons: {
    shortcut: [
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: {
      rel: "mask-icon",
      url: "/safari-pinned-tab.svg",
      color: "#5bbad5",
    },
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  metadataBase: new URL("https://www.playtesla.xyz"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="ko">
      <body className={pretendard.className}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
