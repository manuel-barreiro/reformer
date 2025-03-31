import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bookClass, cancelBooking } from "@/actions/booking-actions"
import { deleteClass, toggleClassLock } from "@/actions/class"
import { toast } from "@/components/ui/use-toast"
import { ClassWithBookings } from "@/components/modules/roles/common/calendario/types"

export function useClassMutations(date: Date, onClassChange: () => void) {
  const queryClient = useQueryClient()
  const monthKey = date.toISOString().substring(0, 7) // "YYYY-MM" format for query key

  // Book class mutation
  const useBookClassMutation = (classId: string) => {
    return useMutation({
      mutationFn: () => bookClass(classId),
      onSuccess: (result) => {
        if (result.success) {
          toast({
            title: "Clase reservada",
            description: "La clase ha sido reservada exitosamente.",
            variant: "reformer",
          })
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ["classes", monthKey] })
          queryClient.invalidateQueries({ queryKey: ["bookings", monthKey] })
          onClassChange()
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        }
      },
      onError: (error) => {
        toast({
          title: "Error",
          description:
            "No se pudo realizar la reserva. Por favor intente nuevamente.",
          variant: "destructive",
        })
      },
    })
  }

  // Cancel booking mutation
  const useCancelBookingMutation = (bookingId?: string) => {
    return useMutation({
      mutationFn: () => {
        if (!bookingId) throw new Error("No booking found")
        return cancelBooking(bookingId)
      },
      onSuccess: (result) => {
        if (result.success) {
          toast({
            title: "Reserva cancelada",
            description: "La reserva ha sido cancelada exitosamente.",
            variant: "reformer",
          })
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ["classes", monthKey] })
          queryClient.invalidateQueries({ queryKey: ["bookings", monthKey] })
          onClassChange()
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        }
      },
      onError: (error) => {
        toast({
          title: "Error",
          description:
            "No se pudo cancelar la reserva. Por favor intente nuevamente.",
          variant: "destructive",
        })
      },
    })
  }

  // Toggle class lock mutation
  const useToggleLockMutation = (class_: ClassWithBookings) => {
    return useMutation({
      mutationFn: () => toggleClassLock(class_.id),
      onMutate: async () => {
        // Optimistic update
        const previousClasses = queryClient.getQueryData(["classes", monthKey])

        queryClient.setQueryData(
          ["classes", monthKey],
          (oldData: ClassWithBookings[] | undefined) => {
            if (!oldData) return []
            return oldData.map((cls) =>
              cls.id === class_.id ? { ...cls, isActive: !cls.isActive } : cls
            )
          }
        )

        return { previousClasses }
      },
      onSuccess: (result) => {
        if (result.success) {
          toast({
            title: class_.isActive ? "Clase bloqueada" : "Clase desbloqueada",
            description: class_.isActive
              ? "La clase ha sido bloqueada y no será visible para los usuarios."
              : "La clase ha sido desbloqueada y ahora es visible para los usuarios.",
            variant: "reformer",
          })
          queryClient.invalidateQueries({ queryKey: ["classes", monthKey] })
          onClassChange()
        } else {
          toast({
            title: "Error",
            description: "No se pudo cambiar el estado de la clase.",
            variant: "destructive",
          })
        }
      },
      onError: (error, _, context) => {
        // Rollback to previous state on error
        if (context?.previousClasses) {
          queryClient.setQueryData(
            ["classes", monthKey],
            context.previousClasses
          )
        }
        toast({
          title: "Error",
          description: "No se pudo cambiar el estado de la clase.",
          variant: "destructive",
        })
      },
    })
  }

  // Delete class mutation
  const useDeleteClassMutation = (classId: string) => {
    return useMutation({
      mutationFn: () => deleteClass(classId),
      onSuccess: (result) => {
        if (result.success) {
          toast({
            title: "Clase eliminada",
            description: "La clase ha sido eliminada exitosamente.",
            variant: "reformer",
          })
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ["classes", monthKey] })
          queryClient.invalidateQueries({ queryKey: ["bookings", monthKey] })
          onClassChange()
        } else {
          toast({
            title: "Error",
            description: result.error || "Error al eliminar la clase.",
            variant: "destructive",
          })
        }
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Error al eliminar la clase.",
          variant: "destructive",
        })
      },
    })
  }

  return {
    useBookClassMutation,
    useCancelBookingMutation,
    useToggleLockMutation,
    useDeleteClassMutation,
  }
}
