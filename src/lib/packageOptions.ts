export type PackageType = "pkg_1" | "pkg_4" | "pkg_8" | "pkg_12"

export type ClassType = "yoga" | "pilates"

export type Package = {
  id: PackageType
  name: string
  classQuantity: number
  price: number
}

export const packageOptions: Package[] = [
  { id: "pkg_1", name: "PAQUETE X1 CLASE", classQuantity: 1, price: 18000 },
  { id: "pkg_4", name: "PAQUETE X4 CLASES", classQuantity: 4, price: 60000 },
  { id: "pkg_8", name: "PAQUETE X8 CLASES", classQuantity: 8, price: 112000 },
  {
    id: "pkg_12",
    name: "PAQUETE X12 CLASES",
    classQuantity: 12,
    price: 144000,
  },
]

export const getPackageType = (packageId: Package["id"]): PackageType => {
  return `${packageId}` as PackageType
}
