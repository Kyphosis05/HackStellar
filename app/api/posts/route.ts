import { NextResponse } from "next/server"

// Mock data store (in production, use a real database)
const posts = [
  {
    id: "1",
    content: "Stellar blockchain ile sosyal medya deneyimi harika! Herkes denemeye başlayabilir.",
    authorPublicKey: "GAIXAMPLE1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    likes: 24,
    comments: 5,
    donations: 15.5,
    isLiked: false,
  },
  {
    id: "2",
    content: "Yeni challenge başlattım! En yaratıcı içerik 500 XLM kazanacak. Katılmak için beni takip edin!",
    authorPublicKey: "GBEXAMPLE2234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 42,
    comments: 12,
    donations: 38.2,
    isLiked: false,
  },
  {
    id: "3",
    content: "Blockchain teknolojisi ile sosyal medyanın geleceğini birlikte inşa ediyoruz. Bu platform muhteşem!",
    authorPublicKey: "GCEXAMPLE3234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    likes: 67,
    comments: 18,
    donations: 92.7,
    isLiked: false,
  },
]

export async function GET() {
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newPost = {
    id: Date.now().toString(),
    content: body.content,
    authorPublicKey: body.authorPublicKey,
    createdAt: new Date(),
    likes: 0,
    comments: 0,
    donations: 0,
    isLiked: false,
  }

  posts.unshift(newPost)

  return NextResponse.json(newPost, { status: 201 })
}
