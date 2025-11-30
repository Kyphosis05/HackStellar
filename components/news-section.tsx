"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface NewsItem {
  title: string
  source: string
  time: string
}

export function NewsSection() {
  const [news] = useState<NewsItem[]>([
    { title: "Bitcoin 100K Yolunda!", source: "CoinDesk", time: "2s önce" },
    {
      title: "Ethereum ETF'leri Onaylandı mı?",
      source: "CoinTelegraph",
      time: "5s önce",
    },
    {
      title: "Yeni Web3 Trendleri: SocialFi",
      source: "BlockSocial",
      time: "10s önce",
    },
  ])

  return (
    <div>
      <h2 className="mb-6 border-l-4 border-primary pl-4 text-3xl font-bold">Son Dakika</h2>
      <div className="space-y-4">
        {news.map((item, index) => (
          <Card
            key={index}
            className="cursor-pointer border-border/50 bg-card p-6 transition-colors hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.source}</p>
              </div>
              <div className="text-sm text-muted-foreground">{item.time}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
