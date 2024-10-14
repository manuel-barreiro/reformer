import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const packages = await prisma.classPackage.findMany()
    return NextResponse.json(packages)
  } catch (error) {
    return NextResponse.error()
  }
}
