import AdminLayout from "@/components/modules/admin/common/AdminLayout"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
