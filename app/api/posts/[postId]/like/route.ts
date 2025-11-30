import { NextResponse } from "next/server"

// This would normally interact with a database
const likedPosts = new Map<string, Set<string>>()

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  const { postId } = params
  const { publicKey } = await request.json()

  if (!likedPosts.has(postId)) {
    likedPosts.set(postId, new Set())
  }

  const likes = likedPosts.get(postId)!

  if (likes.has(publicKey)) {
    likes.delete(publicKey)
  } else {
    likes.add(publicKey)
  }

  return NextResponse.json({
    liked: likes.has(publicKey),
    count: likes.size,
  })
}
