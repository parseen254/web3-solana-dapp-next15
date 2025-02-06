import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { AppWalletProvider } from "@/providers/WalletProvider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/app/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3 + Solana  Next App",
  description: "A web3-first Next.js app for Solana",
  icons: [
    {
      rel: "icon",
      type: "image/svg+xml",
      url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>%F0%9F%9A%80</text></svg>",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWalletProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider
              basePath={"/auth"}
              session={session}
              refetchInterval={0}
            >
              {children}
            </SessionProvider>
            <Toaster />
          </ThemeProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
