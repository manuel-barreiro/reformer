import AppLayout from "@/components/modules/roles/common/AppLayout"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
