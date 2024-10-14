import CheckoutPage from "@/components/modules/checkout/CheckoutPage"
import { prisma } from "@/lib/prisma"

async function getClassPackages() {
  return await prisma.classPackage.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      classCount: "asc",
    },
  })
}

export default async function Checkout() {
  const classPackages = await getClassPackages()
  return <CheckoutPage classPackages={classPackages} />
}
