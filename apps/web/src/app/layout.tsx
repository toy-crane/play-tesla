import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
