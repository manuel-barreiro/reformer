import type { Metadata, Viewport } from "next"
import { Marcellus, DM_Sans, DM_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/routes/root/Header/Header"

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
  description: "Transformá tu cuerpo, y elevá tu mente",
  icons: {
    icon: [
      { url: "/icons/favicon-light.png" },
      new URL("/icons/favicon-light.png", "https://reformer.com.ar"),
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
}

export const viewport: Viewport = {
  themeColor: "#231f20",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className="scrollbar-hide overflow-hidden scroll-smooth"
      style={{ cursor: "url(icons/solPearl.svg),auto" }}
    >
      <body
        className={`${marcellus.variable} ${dm_sans.variable} ${dm_sans.className} ${dm_mono.variable} scrollbar-hide overflow-hidden`}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
