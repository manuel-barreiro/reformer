import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  packageOptions,
  Package,
  ClassType,
  getPackageType,
  PackageType,
} from "@/lib/packageOptions"

export const useCheckout = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package>(
    packageOptions[0]
  )
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      const packageType: PackageType = selectedPackage.id

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/create-preference`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packageType: packageType,
            packageName: selectedPackage.name,
            packageDescription: `Paquete de ${selectedPackage.classQuantity} ${
              selectedPackage.classQuantity > 1 ? "clases" : "clase"
            }`,
            packagePrice: selectedPackage.price,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()

      if (data.redirectUrl) {
        router.push(data.redirectUrl)
      } else {
        console.error("No redirect URL received from the server")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      // Handle the error (e.g., show an error message to the user)
    }
  }

  return {
    selectedPackage,
    setSelectedPackage,
    handleCheckout,
    packageOptions,
  }
}
