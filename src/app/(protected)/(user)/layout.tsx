import SideMenu from "@/components/modules/user/common/SideMenu"
import UserLayout from "@/components/modules/user/common/UserLayout"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <UserLayout>{children}</UserLayout>
}
