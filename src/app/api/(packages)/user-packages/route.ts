import { NextRequest, NextResponse } from "next/server"
import { getActiveClassPackages } from "@/actions/package-actions"

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const packages = await getActiveClassPackages()
    return NextResponse.json(packages)
  } catch (error) {
    return NextResponse.error()
  }
}
