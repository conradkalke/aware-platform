import { NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/admin-auth"

export async function GET() {
  const { authorized } = await getAdminAuth()
  return NextResponse.json({ authorized })
}
