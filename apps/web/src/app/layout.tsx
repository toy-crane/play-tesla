import "./globals.css";

import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
});

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
      </body>
    </html>
  );
}
