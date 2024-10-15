import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { getActiveClassPackages } from "@/actions/package-actions"

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const packages = await getActiveClassPackages()
    return NextResponse.json(packages)
  } catch (error) {
    return NextResponse.error()
  }
}
