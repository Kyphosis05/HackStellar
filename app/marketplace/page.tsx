"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, Search } from "lucide-react"

const tokens = [
  {
    id: "1",
    name: "Creator Token Alpha",
    symbol: "CTA",
    price: "12.50",
    change24h: 5.2,
    volume: "15,420",
    marketCap: "145,000",
    creator: "GAIXAMPLE1234567890",
  },
  {
    id: "2",
    name: "Content Coin Beta",
    symbol: "CCB",
    price: "8.75",
    change24h: -2.1,
    volume: "9,850",
    marketCap: "87,500",
    creator: "GBEXAMPLE2234567890",
  },
  {
    id: "3",
    name: "Social Token Gamma",
    symbol: "STG",
    price: "25.30",
    change24h: 12.8,
    volume: "32,100",
    marketCap: "253,000",
    creator: "GCEXAMPLE3234567890",
  },
  {
    id: "4",
    name: "Influence Token Delta",
    symbol: "ITD",
    price: "6.40",
    change24h: 3.5,
    volume: "7,200",
    marketCap: "64,000",
    creator: "GDEXAMPLE4234567890",
  },
]

export default function MarketplacePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Marketplace</h1>
          <p className="mt-2 text-muted-foreground">İçerik üreticilerinin coin'lerini keşfedin ve ticaret yapın</p>
        </div>

        <div className="mb-8 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Token ara..." className="pl-10 border-border/50 bg-background" />
          </div>
          <Button variant="outline" className="border-border/50 bg-transparent">
            Filtrele
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token) => (
            <Card key={token.id} className="border-border/50 bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{token.name}</h3>
                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-sm font-bold text-primary">{token.symbol.slice(0, 2)}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{token.price}</span>
                  <span className="text-sm text-muted-foreground">XLM</span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  {token.change24h > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">+{token.change24h}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-500">{token.change24h}%</span>
                    </>
                  )}
                  <span className="text-sm text-muted-foreground">24s</span>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hacim</span>
                  <span className="font-medium">{token.volume} XLM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-medium">{token.marketCap} XLM</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Satın Al</Button>
                <Button variant="outline" className="flex-1 border-border/50 bg-transparent">
                  Detay
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-border/50 bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Kendi Token'ınızı Oluşturun</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            İçerik üreticisi olarak kendi coin'inizi oluşturabilir ve takipçilerinizle doğrudan ekonomik ilişki
            kurabilirsiniz.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Token Oluştur</Button>
        </Card>
      </div>
    </div>
  )
}
