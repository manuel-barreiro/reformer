"use client"

import { useState } from "react"
import {
  User,
  PurchasedPackage,
  ClassPackage,
  Payment,
  Booking,
  Class,
  Category,
  Subcategory,
} from "@prisma/client"
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
import { updateUser } from "@/actions/users"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { UserPackagesTab } from "./tabs/UserPackagesTab"
import { UserPaymentsTab } from "./tabs/UserPaymentsTab"
import { UserBookingsTab } from "./tabs/UserBookingsTab"

interface ExtendedPurchasedPackage extends PurchasedPackage {
  classPackage: ClassPackage
  payment: {
    total: number
    status: string
    dateCreated: Date
  } | null
}

interface ClassWithDetails extends Class {
  category: Category
  subcategory: Subcategory
}

interface ExtendedBooking extends Booking {
  class: ClassWithDetails
}

interface UserDetailViewProps {
  user: User & {
    purchasedPackages: ExtendedPurchasedPackage[]
    payments: Payment[]
    bookings: ExtendedBooking[]
  }
  availablePackages: ClassPackage[]
}

export function UserDetailView({
  user,
  availablePackages,
}: UserDetailViewProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleUpdateUser = async (userId: string, userData: Partial<User>) => {
    try {
      await updateUser(userId, {
        name: userData.name!,
        role: userData.role!,
        surname: userData.surname,
        phone: userData.phone,
      })

      toast({
        title: "Usuario actualizado",
        description:
          "La información del usuario ha sido actualizada con éxito.",
        variant: "reformer",
      })

      setIsDetailModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to update user:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la información del usuario.",
        variant: "destructive",
      })
    }
  }

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
            user={user}
            packages={user.purchasedPackages}
            availablePackages={availablePackages}
          />
        </TabsContent>

        <TabsContent value="payments">
          <UserPaymentsTab payments={user.payments} />
        </TabsContent>

        <TabsContent value="bookings">
          <UserBookingsTab bookings={user.bookings} />
        </TabsContent>
      </Tabs>

      {/* User detail modal for editing */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  )
}
