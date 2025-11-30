"use client"

import { useEffect, useState } from "react"
import { PostCard, type Post } from "./post-card"
import { DonateDialog } from "./donate-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface FeedProps {
  refreshTrigger?: number
}

export function Feed({ refreshTrigger }: FeedProps) {
  const { data: posts, error, mutate } = useSWR<Post[]>("/api/posts", fetcher)
  const [donateDialogOpen, setDonateDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  useEffect(() => {
    if (refreshTrigger) {
      mutate()
    }
  }, [refreshTrigger, mutate])

  const handleLike = async (postId: string) => {
    const publicKey = localStorage.getItem("stellar_public_key")
    if (!publicKey) return

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      })
      mutate()
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleDonate = (postId: string) => {
    const post = posts?.find((p) => p.id === postId)
    if (post) {
      setSelectedPost(post)
      setDonateDialogOpen(true)
    }
  }

  const handleDonationSuccess = () => {
    mutate()
  }

  if (error) {
    return <div className="text-center py-12 text-muted-foreground">Gönderiler yüklenirken bir hata oluştu</div>
  }

  if (!posts) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 rounded-lg border border-border/50 bg-card p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">Henüz gönderi yok. İlk gönderen siz olun!</div>
  }

  return (
    <>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} onDonate={handleDonate} />
        ))}
      </div>

      {selectedPost && (
        <DonateDialog
          open={donateDialogOpen}
          onOpenChange={setDonateDialogOpen}
          recipientPublicKey={selectedPost.authorPublicKey}
          postId={selectedPost.id}
          onSuccess={handleDonationSuccess}
        />
      )}
    </>
  )
}
