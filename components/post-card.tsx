"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Coins } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

export interface Post {
  id: string
  content: string
  authorPublicKey: string
  createdAt: Date
  likes: number
  comments: number
  donations: number
  isLiked?: boolean
}

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onDonate?: (postId: string) => void
}

export function PostCard({ post, onLike, onDonate }: PostCardProps) {
  const authorInitials = post.authorPublicKey.slice(0, 2).toUpperCase()
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: tr,
  })

  return (
    <Card className="border-border/50 bg-card p-6">
      {/* Author Info */}
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary">{authorInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {post.authorPublicKey.slice(0, 6)}...{post.authorPublicKey.slice(-4)}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          <p className="mt-3 text-foreground leading-relaxed">{post.content}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-2 border-t border-border/50 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike?.(post.id)}
          className={post.isLiked ? "text-red-500" : "text-muted-foreground"}
        >
          <Heart className={`mr-2 h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
          {post.likes}
        </Button>

        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageCircle className="mr-2 h-4 w-4" />
          {post.comments}
        </Button>

        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Share2 className="mr-2 h-4 w-4" />
          Paylaş
        </Button>

        <div className="flex-1" />

        <Button
          size="sm"
          onClick={() => onDonate?.(post.id)}
          className="bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Coins className="mr-2 h-4 w-4" />
          Bağış Yap
        </Button>
      </div>

      {post.donations > 0 && (
        <div className="mt-3 text-sm text-muted-foreground">
          Bu içerik toplam <span className="font-semibold text-primary">{post.donations} XLM</span> bağış aldı
        </div>
      )}
    </Card>
  )
}
