"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateChallengeDialog } from "@/components/create-challenge-dialog"
import { Trophy, Clock, Users, Coins } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

const challenges = [
  {
    id: "1",
    title: "En İyi Video Challenge",
    description: "En yaratıcı ve ilham verici video içeriğini paylaşın. Topluluk tarafından en çok beğenilen kazanır!",
    prize: "500",
    participants: 42,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days
    status: "active",
    creator: "GAIXAMPLE1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  },
  {
    id: "2",
    title: "Yaratıcı İçerik Yarışması",
    description: "Blockchain ve kripto hakkında özgün içerikler oluşturun. En bilgilendirici paylaşım ödül kazanır.",
    prize: "300",
    participants: 28,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
    status: "active",
    creator: "GBEXAMPLE2234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  },
  {
    id: "3",
    title: "Fotoğraf Challenge",
    description: "Kripto ve blockchain temalı en iyi fotoğrafı paylaşın.",
    prize: "200",
    participants: 19,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    status: "active",
    creator: "GCEXAMPLE3234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  },
  {
    id: "4",
    title: "En İyi Meme Yarışması",
    description: "Stellar ve blockchain hakkında en komik ve yaratıcı meme'i oluşturun!",
    prize: "150",
    participants: 67,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days
    status: "active",
    creator: "GDEXAMPLE4234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  },
]

export default function ChallengesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleJoinChallenge = (challengeId: string) => {
    const publicKey = localStorage.getItem("stellar_public_key")

    if (!publicKey) {
      toast({
        title: "Cüzdan Gerekli",
        description: "Challenge'a katılmak için cüzdanınızı bağlayın.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Challenge'a Katıldınız!",
      description: "Başarılar! İçeriğinizi paylaşmaya başlayabilirsiniz.",
    })
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Challenge'lar</h1>
          <p className="mt-2 text-muted-foreground">Yaratıcı challenge'lara katılın ve XLM ödüllerini kazanın</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border/50 bg-transparent">
              Tümü
            </Button>
            <Button variant="ghost" size="sm">
              Aktif
            </Button>
            <Button variant="ghost" size="sm">
              Bitti
            </Button>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Challenge Oluştur
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="border-border/50 bg-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{challenge.title}</h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {challenge.status === "active" ? "Aktif" : "Bitti"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{challenge.description}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-6 border-t border-border/50 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{challenge.prize} XLM</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{challenge.participants} katılımcı</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(challenge.endDate, {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  onClick={() => handleJoinChallenge(challenge.id)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Challenge'a Katıl
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <CreateChallengeDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}
