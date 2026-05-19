import type { Metadata } from "next"
import { Lora, Roboto_Mono, Inter, Geist } from "next/font/google";
import "./globals.css"

import { ThemeProvider } from "@/components/common/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

  const inter = Inter({subsets:['latin'],variable:'--font-sans'});

  const fontSerif = Lora({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-serif",
  });

  const fontMono = Roboto_Mono({
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
      className={cn("h-full", "antialiased", fontSerif.variable, fontMono.variable, "font-sans", inter.variable, geistHeading.variable)}
    >
      <body className="flex h-full min-h-0 flex-col">
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
