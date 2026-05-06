import type { Metadata } from "next"
import { Geist, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css"

import { AppShell } from "@/components/app-shell"
import { ThemeProvider } from "@/components/theme-provider"

  const fontSans = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
  });

  const fontSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-serif",
  });

  const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
  });

export const metadata: Metadata = {
  title: "IoT Security Platform",
  description: "IoT device inventory and security posture",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
