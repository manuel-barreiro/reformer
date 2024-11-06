import { ClassPackage } from "@prisma/client"

export type ClassPackageProps = Pick<
  ClassPackage,
  | "name"
  | "id"
  | "description"
  | "classCount"
  | "price"
  | "durationMonths"
  | "isActive"
>
