import type { Metadata } from "next"

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
