import type { Metadata, Viewport } from "next"
import { Marcellus, DM_Sans, DM_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { auth } from "@/auth"
import JsonLd from "@/components/JsonLd"
import { QueryProvider } from "@/providers/QueryProvider"

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
})

const dm_sans = DM_Sans({
  weight: ["200", "300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm_sans",
})

const dm_mono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm_mono",
})

export const metadata: Metadata = {
  title: "Reformer | Wellness Club",
  description:
    "Transformá tu cuerpo, y elevá tu mente en el mejor wellness club. Clases de pilates reformer, yoga, meditación y más.",
  metadataBase: new URL("https://www.reformer.com.ar"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-light.png" },
      new URL("/icons/favicon-light.png", "https://www.reformer.com.ar"),
      { url: "/icons/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: ["/icons/favicon-light.png"],
    apple: [
      { url: "/icons/opengraph-image.png" },
      {
        url: "/icons/opengraph-image.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "opengraph-image",
        url: "/icons/opengraph-image.png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "pilates",
    "reformer",
    "wellness",
    "yoga",
    "meditación",
    "buenos aires",
    "argentina",
  ],
  authors: [{ name: "Reformer" }],
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code
  },
}

export const viewport: Viewport = {
  themeColor: "#231f20",
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
}

export default async function Root({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="es" className="scrollbar-hide scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${marcellus.variable} ${dm_sans.variable} ${dm_sans.className} ${dm_mono.variable} scrollbar-hide`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
