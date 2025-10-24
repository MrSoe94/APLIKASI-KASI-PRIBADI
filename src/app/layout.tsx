import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aplikasi Pencatatan Keuangan",
  description: "Aplikasi pencatatan keuangan pribadi dengan penyimpanan data di server JSON",
  keywords: ["keuangan", "pencatatan", "transaksi", "pemasukan", "pengeluaran", "Next.js", "TypeScript"],
  authors: [{ name: "Financial App Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Aplikasi Pencatatan Keuangan",
    description: "Aplikasi pencatatan keuangan pribadi yang mudah digunakan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aplikasi Pencatatan Keuangan",
    description: "Aplikasi pencatatan keuangan pribadi yang mudah digunakan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
