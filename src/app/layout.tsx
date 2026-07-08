import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceReceipt",
  description: "Voice-to-receipt for Nigerian businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
