import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { getAllClassPackages } from "@/actions/package-actions"

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const packages = await getAllClassPackages()
    return NextResponse.json(packages)
  } catch (error) {
    return NextResponse.error()
  }
}
