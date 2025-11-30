"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { CreatePost } from "@/components/create-post"
import { Feed } from "@/components/feed"
import { Card } from "@/components/ui/card"
import { TrendingUp, Trophy, Users } from "lucide-react"

export default function FeedPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Feed */}
          <div className="space-y-6">
            <CreatePost onPostCreated={() => setRefreshTrigger(Date.now())} />
            <Feed refreshTrigger={refreshTrigger} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-card p-6">
              <h3 className="font-semibold mb-4">Trending Challenge'lar</h3>
              <div className="space-y-3">
                {[
                  { title: "En İyi Video Challenge", prize: "500 XLM" },
                  { title: "Yaratıcı İçerik Yarışması", prize: "300 XLM" },
                  { title: "Fotoğraf Challenge", prize: "200 XLM" },
                ].map((challenge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border/30 p-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{challenge.title}</div>
                      <div className="text-xs text-primary">{challenge.prize}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border/50 bg-card p-6">
              <h3 className="font-semibold mb-4">Platform İstatistikleri</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Aktif Kullanıcı
                  </div>
                  <span className="font-semibold text-primary">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Toplam Bağış
                  </div>
                  <span className="font-semibold text-primary">45,678 XLM</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4" />
                    Aktif Challenge
                  </div>
                  <span className="font-semibold text-primary">23</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
