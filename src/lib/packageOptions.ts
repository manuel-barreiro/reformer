export type PackageType =
  | "pkg_1_yoga"
  | "pkg_4_yoga"
  | "pkg_8_yoga"
  | "pkg_12_yoga"
  | "pkg_1_pilates"
  | "pkg_4_pilates"
  | "pkg_8_pilates"
  | "pkg_12_pilates"

export type ClassType = "yoga" | "pilates"

export type Package = {
  id: "pkg_1" | "pkg_4" | "pkg_8" | "pkg_12"
  name: string
  classQuantity: number
  price: number
}

export const packageOptions: Package[] = [
  { id: "pkg_4", name: "PAQUETE X4 CLASES", classQuantity: 4, price: 56000 },
  { id: "pkg_8", name: "PAQUETE X8 CLASES", classQuantity: 8, price: 96000 },
  {
    id: "pkg_12",
    name: "PAQUETE X12 CLASES",
    classQuantity: 12,
    price: 120000,
  },
  { id: "pkg_1", name: "CLASE INDIVIDUAL", classQuantity: 1, price: 15000 },
]

export const getPackageType = (
  packageId: Package["id"],
  classType: ClassType
): PackageType => {
  return `${packageId}_${classType}` as PackageType
}
