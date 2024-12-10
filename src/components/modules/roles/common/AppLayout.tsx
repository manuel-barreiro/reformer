import { AppSidebar } from "@/components/modules/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { auth } from "@/auth"
import SidebarHeaderText from "@/components/modules/sidebar/SidebarHeaderText"
import UserAvatar from "@/components/modules/sidebar/UserAvatar"
import { cn } from "@/lib/utils"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const user = {
    name: session?.user?.name ?? "Guest",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
    role: session?.user?.role ?? "user",
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="bg-pearl">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 pr-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <SidebarHeaderText />
          </div>
          <div className="block md:hidden">
            <UserAvatar user={user} />
          </div>
        </header>
        <div
          className={cn(
            "flex h-full flex-1 flex-col items-center justify-center gap-4 px-4 pb-4",
            user.role === "admin" ? "pt-0" : "pt-6"
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
