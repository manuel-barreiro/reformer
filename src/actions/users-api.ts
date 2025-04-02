"use server"
import { prisma } from "@/lib/prisma"
import {
  User,
  PurchasedPackage,
  ClassPackage,
  Payment,
  Booking,
} from "@prisma/client"

// Types for our API responses
type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

// Get user details with all related data
export async function getUserDetails(
  userId: string
): Promise<ApiResponse<any>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        purchasedPackages: {
          include: {
            classPackage: true,
            payment: {
              select: {
                total: true,
                status: true,
                dateCreated: true,
              },
            },
          },
        },
        payments: {
          orderBy: {
            dateCreated: "desc",
          },
        },
        bookings: {
          include: {
            class: {
              include: {
                category: true,
                subcategory: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    return { success: true, data: user }
  } catch (error) {
    console.error("Error fetching user details:", error)
    return { success: false, error: "Failed to fetch user details" }
  }
}

// Get available packages
export async function getAvailablePackages(): Promise<
  ApiResponse<ClassPackage[]>
> {
  try {
    const packages = await prisma.classPackage.findMany({
      where: { isActive: true },
    })
    return { success: true, data: packages }
  } catch (error) {
    console.error("Error fetching packages:", error)
    return { success: false, error: "Failed to fetch packages" }
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  userData: Partial<User>
): Promise<ApiResponse<User>> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
      },
    })
    return { success: true, data: updatedUser }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

// Assign package to user
export async function assignPackageToUser(
  userId: string,
  packageData: {
    classPackageId: string
    expirationDate: string
  }
): Promise<ApiResponse<PurchasedPackage>> {
  try {
    const classPackage = await prisma.classPackage.findUnique({
      where: { id: packageData.classPackageId },
    })

    if (!classPackage) {
      return { success: false, error: "Package not found" }
    }

    const purchasedPackage = await prisma.purchasedPackage.create({
      data: {
        userId: userId,
        classPackageId: packageData.classPackageId,
        expirationDate: new Date(packageData.expirationDate),
        status: "active",
        remainingClasses: classPackage.classCount,
      },
    })

    return { success: true, data: purchasedPackage }
  } catch (error) {
    console.error("Error assigning package:", error)
    return { success: false, error: "Failed to assign package" }
  }
}

// Update purchased package
export async function updatePurchasedPackage(
  packageId: string,
  updateData: {
    remainingClasses: number
    expirationDate: string
  }
): Promise<ApiResponse<PurchasedPackage>> {
  try {
    const updatedPackage = await prisma.purchasedPackage.update({
      where: { id: packageId },
      data: {
        remainingClasses: updateData.remainingClasses,
        expirationDate: new Date(updateData.expirationDate),
      },
    })

    return { success: true, data: updatedPackage }
  } catch (error) {
    console.error("Error updating package:", error)
    return { success: false, error: "Failed to update package" }
  }
}

// Delete purchased package
export async function deletePurchasedPackage(
  packageId: string
): Promise<ApiResponse<void>> {
  try {
    // First delete all bookings associated with this package
    await prisma.booking.deleteMany({
      where: { purchasedPackageId: packageId },
    })

    // Then delete the package
    await prisma.purchasedPackage.delete({
      where: { id: packageId },
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting package:", error)
    return { success: false, error: "Failed to delete package" }
  }
}

// Get user bookings
export async function getUserBookings(
  userId: string
): Promise<ApiResponse<Booking[]>> {
  try {
    console.log("Server: Fetching bookings for user:", userId)

    const bookings = await prisma.booking.findMany({
      where: { userId: userId },
      include: {
        class: {
          include: {
            category: true,
            subcategory: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, data: bookings }
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch user bookings",
    }
  }
}

// Get user payments
export async function getUserPayments(
  userId: string
): Promise<ApiResponse<Payment[]>> {
  try {
    console.log("Server: Fetching payments for user:", userId)

    const payments = await prisma.payment.findMany({
      where: { userId: userId },
      orderBy: {
        dateCreated: "desc",
      },
    })

    return { success: true, data: payments }
  } catch (error) {
    console.error("Error fetching user payments:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch user payments",
    }
  }
}
