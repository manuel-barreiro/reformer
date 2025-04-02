"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChevronLeft,
  Edit,
  User as UserIcon,
  Package,
  CreditCard,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { UserDetailModal } from "./UserDetailModal"
import { useRouter } from "next/navigation"
import { UserPackagesTab } from "./tabs/UserPackagesTab"
import { UserPaymentsTab } from "./tabs/UserPaymentsTab"
import { UserBookingsTab } from "./tabs/UserBookingsTab"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useUserDetails,
  useAvailablePackages,
  useUpdateUser,
} from "@/components/modules/roles/admin/usuarios/hooks/useUserQueries"

interface UserDetailViewProps {
  userId: string
}

export function UserDetailView({ userId }: UserDetailViewProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const router = useRouter()

  // Fetch user data with Tanstack Query
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useUserDetails(userId)

  // Fetch available packages with Tanstack Query
  const { data: packagesData, isLoading: isPackagesLoading } =
    useAvailablePackages()

  // Get the update user mutation
  const updateUserMutation = useUpdateUser()

  // Handle updating user data
  const handleUpdateUser = async (userId: string, userData: any) => {
    updateUserMutation.mutate({ userId, userData })
    setIsDetailModalOpen(false)
  }

  // Show loading state while data is being fetched
  if (isUserLoading) {
    return (
      <div className="h-full w-full space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  // Show error state if fetching failed
  if (userError || !userData?.success) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-6">
        <h2 className="mb-4 text-2xl font-bold text-rust">
          Error al cargar los datos del usuario
        </h2>
        <p className="mb-6 text-grey_pebble">
          {userData?.error || "No se pudo cargar la información del usuario."}
        </p>
        <Button
          onClick={() => router.push("/admin/usuarios")}
          className="bg-midnight text-pearl hover:bg-midnight/90"
        >
          Volver a la lista de usuarios
        </Button>
      </div>
    )
  }

  const user = userData.data
  const availablePackages = packagesData?.data || []

  return (
    <div className="h-full w-full space-y-6 p-6">
      {/* Header with back button and user info */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/usuarios"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver a usuarios
          </Link>
          <h2 className="font-marcellus text-2xl font-bold">
            {user.name} {user.surname}
          </h2>
          <h3 className="font-dm_mono">[{user.email}]</h3>
        </div>
        <Button
          onClick={() => setIsDetailModalOpen(true)}
          className="bg-rust text-pearl hover:bg-rust/90"
          disabled={updateUserMutation.isPending}
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar Usuario
        </Button>
      </div>

      {/* User metadata card */}
      <Card className="bg-pearlVariant">
        <CardHeader>
          <CardTitle className="font-marcellus text-xl text-grey_pebble">
            Información del Usuario
          </CardTitle>
          <CardDescription>Datos personales y de contacto</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Nombre</h4>
            <p className="text-grey_pebble">
              {user.name} {user.surname || ""}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Email</h4>
            <p className="font-dm_mono text-sm text-grey_pebble">
              {user.email}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Teléfono</h4>
            <p className="text-grey_pebble">{user.phone || "No registrado"}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Rol</h4>
            <div className="flex items-center">
              <div
                className={`mr-2 rounded-full ${user.role === "admin" ? "bg-rust" : "bg-grey_pebble"} p-1`}
              >
                <UserIcon className="h-3 w-3 text-pearl" />
              </div>
              <span className="text-grey_pebble">
                {user.role === "admin" ? "Administrador" : "Usuario"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Tabs */}
      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-pearlVariant3">
          <TabsTrigger
            value="packages"
            className="data-[state=active]:bg-rust data-[state=active]:text-pearl"
          >
            <Package className="mr-2 h-4 w-4" /> Paquetes
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-rust data-[state=active]:text-pearl"
          >
            <CreditCard className="mr-2 h-4 w-4" /> Pagos
          </TabsTrigger>
          <TabsTrigger
            value="bookings"
            className="data-[state=active]:bg-rust data-[state=active]:text-pearl"
          >
            <Calendar className="mr-2 h-4 w-4" /> Reservas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages">
          <UserPackagesTab
            userId={userId}
            packages={user.purchasedPackages}
            availablePackages={availablePackages}
            isLoading={isPackagesLoading}
          />
        </TabsContent>

        <TabsContent value="payments">
          <UserPaymentsTab userId={userId} />{" "}
        </TabsContent>

        <TabsContent value="bookings">
          <UserBookingsTab userId={userId} />{" "}
        </TabsContent>
      </Tabs>

      {/* User detail modal for editing */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        isLoading={updateUserMutation.isPending}
      />
    </div>
  )
}
