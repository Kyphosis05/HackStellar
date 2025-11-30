import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { publicKey } = body

  // In production, store likes in database
  console.log(`User ${publicKey} liked post ${params.id}`)

  return NextResponse.json({ success: true })
}
