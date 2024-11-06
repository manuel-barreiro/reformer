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

export type ActionResult = { success: true } | { error: string }

export function isError(result: ActionResult): result is { error: string } {
  return "error" in result
}
