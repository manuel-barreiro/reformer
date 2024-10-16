import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClassPackage } from "@prisma/client"
import { toast } from "@/components/ui/use-toast"

export const useCheckout = (classPackages: ClassPackage[]) => {
  const [selectedPackage, setSelectedPackage] = useState<ClassPackage>(
    classPackages[0]
  )
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        `https://www.reformer.com.ar/api/create-preference`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classPackageId: selectedPackage.id,
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
    }
  }

  return {
    selectedPackage,
    setSelectedPackage,
    handleCheckout,
  }
}
