import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUserDetails,
  getAvailablePackages,
  updateUserProfile,
  assignPackageToUser,
  updatePurchasedPackage,
  deletePurchasedPackage,
  getUserBookings,
  getUserPayments,
} from "@/actions/users-api"
import { toast } from "@/components/ui/use-toast"
import { User } from "@prisma/client"

// Hook for fetching user details
export function useUserDetails(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserDetails(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook for fetching available packages
export function useAvailablePackages() {
  return useQuery({
    queryKey: ["packages", "available"],
    queryFn: () => getAvailablePackages(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook for updating user profile
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string
      userData: Partial<User>
    }) => updateUserProfile(userId, userData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast({
          title: "Usuario actualizado",
          description:
            "La información del usuario ha sido actualizada con éxito.",
          variant: "reformer",
        })

        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ["user", variables.userId] })
      } else {
        toast({
          title: "Error",
          description:
            data.error || "No se pudo actualizar la información del usuario.",
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la información del usuario.",
        variant: "destructive",
      })
    },
  })
}

// Hook for assigning a package to a user
export function useAssignPackage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      packageData,
    }: {
      userId: string
      packageData: { classPackageId: string; expirationDate: string }
    }) => assignPackageToUser(userId, packageData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast({
          title: "Paquete asignado",
          description: "El paquete ha sido asignado con éxito.",
          variant: "reformer",
        })

        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ["user", variables.userId] })
      } else {
        toast({
          title: "Error",
          description: data.error || "No se pudo asignar el paquete.",
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      console.error("Error assigning package:", error)
      toast({
        title: "Error",
        description: "No se pudo asignar el paquete.",
        variant: "destructive",
      })
    },
  })
}

// Hook for updating a purchased package
export function useUpdatePackage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      packageId,
      userId,
      updateData,
    }: {
      packageId: string
      userId: string
      updateData: { remainingClasses: number; expirationDate: string }
    }) => updatePurchasedPackage(packageId, updateData),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast({
          title: "Paquete actualizado",
          description: "El paquete ha sido actualizado con éxito.",
          variant: "reformer",
        })

        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ["user", variables.userId] })
      } else {
        toast({
          title: "Error",
          description: data.error || "No se pudo actualizar el paquete.",
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      console.error("Error updating package:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el paquete.",
        variant: "destructive",
      })
    },
  })
}

// Hook for deleting a purchased package
export function useDeletePackage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      packageId,
      userId,
    }: {
      packageId: string
      userId: string
    }) => deletePurchasedPackage(packageId),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast({
          title: "Paquete eliminado",
          description: "El paquete ha sido eliminado con éxito.",
          variant: "reformer",
        })

        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ["user", variables.userId] })
      } else {
        toast({
          title: "Error",
          description: data.error || "No se pudo eliminar el paquete.",
          variant: "destructive",
        })
      }
    },
    onError: (error) => {
      console.error("Error deleting package:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el paquete.",
        variant: "destructive",
      })
    },
  })
}

// Hook for fetching user bookings
export function useUserBookings(userId: string) {
  // Extra validation
  if (!userId) {
    console.error("useUserBookings called without a userId")
  }

  return useQuery({
    queryKey: ["user", userId, "bookings"],
    queryFn: async () => {
      if (!userId) {
        throw new Error("userId is required to fetch bookings")
      }

      try {
        const response = await getUserBookings(userId)
        if (!response.success) {
          throw new Error(response.error || "Failed to fetch bookings")
        }
        return response
      } catch (error) {
        console.error("Error in useUserBookings:", error)
        throw error
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook for fetching user payments
export function useUserPayments(userId: string) {
  // Extra validation
  if (!userId) {
    console.error("useUserPayments called without a userId")
  }

  return useQuery({
    queryKey: ["user", userId, "payments"],
    queryFn: async () => {
      if (!userId) {
        throw new Error("userId is required to fetch payments")
      }

      try {
        const response = await getUserPayments(userId)
        if (!response.success) {
          throw new Error(response.error || "Failed to fetch payments")
        }
        return response
      } catch (error) {
        console.error("Error in useUserPayments:", error)
        throw error
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
