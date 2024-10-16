import { NextRequest, NextResponse } from "next/server"
import { getAllClassPackages } from "@/actions/package-actions"

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const packages = await getAllClassPackages()
    return NextResponse.json(packages)
  } catch (error) {
    return NextResponse.error()
  }
}
