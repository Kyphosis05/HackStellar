"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ImagePlus, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreatePostProps {
  onPostCreated?: () => void
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const publicKey = localStorage.getItem("stellar_public_key")
    if (!publicKey) {
      toast({
        title: "Cüzdan Gerekli",
        description: "Gönderi paylaşmak için cüzdanınızı bağlayın.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "İçerik Gerekli",
        description: "Lütfen bir şeyler yazın.",
        variant: "destructive",
      })
      return
    }

    setIsPosting(true)
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          authorPublicKey: publicKey,
        }),
      })

      if (response.ok) {
        setContent("")
        toast({
          title: "Başarılı!",
          description: "Gönderiniz paylaşıldı.",
        })
        onPostCreated?.()
      } else {
        throw new Error("Failed to create post")
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Gönderi paylaşılırken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card p-6">
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="Ne düşünüyorsun?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px] resize-none border-border/50 bg-background"
        />
        <div className="mt-4 flex items-center justify-between">
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
            <ImagePlus className="mr-2 h-4 w-4" />
            Görsel Ekle
          </Button>
          <Button
            type="submit"
            disabled={isPosting || !content.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="mr-2 h-4 w-4" />
            Paylaş
          </Button>
        </div>
      </form>
    </Card>
  )
}
