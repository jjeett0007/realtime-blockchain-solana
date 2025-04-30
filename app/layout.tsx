import type React from "react"
import type { Metadata } from "next"
import { Baloo_2, Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const ballo = Baloo_2({
  subsets: ["latin"],
  weight: "400"
})

export const metadata: Metadata = {
  title: "JET SCAN MONITOR | Real-time Solana Blockchain Explorer",
  description: "Track and monitor Solana blockchain transactions in real-time. Live updates, transaction history, and block explorer for Solana network.",
  keywords: "Solana, blockchain, monitor, real-time, transactions, explorer, crypto, JET SCAN",
  authors: [{ name: "JET SCAN MONITOR" }],
  openGraph: {
    title: "JET SCAN MONITOR | Real-time Solana Blockchain Explorer",
    description: "Track and monitor Solana blockchain transactions in real-time",
    type: "website",
    locale: "en_US",
    url: "https://jetscan.monitor",
    siteName: "JET SCAN MONITOR",
    images: [{
      url: "/logo.jpg",
      width: 1200,
      height: 630,
      alt: "JET SCAN MONITOR Preview"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JET SCAN MONITOR | Real-time Solana Blockchain Explorer",
    description: "Track and monitor Solana blockchain transactions in real-time",
    images: ["/logo.jpg"],
    creator: "@jetscanmonitor",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ballo.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
