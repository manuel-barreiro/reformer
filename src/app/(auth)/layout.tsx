import type { Metadata } from "next"
import { Marcellus, DM_Sans, DM_Mono } from "next/font/google"

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
  title: "Auth | Reformer Wellness Club",
  description: "Login or Register for Reformer Wellness Club",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
