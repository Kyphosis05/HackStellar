"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"

interface CryptoData {
  symbol: string
  name: string
  price: number
  change: number
  isPositive: boolean
}

export function CryptoPrices() {
  const [cryptoPrices] = useState<CryptoData[]>([
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 68450,
      change: 2.4,
      isPositive: true,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 3890,
      change: -0.3,
      isPositive: false,
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 145,
      change: 5.1,
      isPositive: true,
    },
  ])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cryptoPrices.map((crypto) => (
        <Card key={crypto.symbol} className="border-border/50 bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-primary">{crypto.symbol}</h3>
              <p className="text-sm text-muted-foreground">{crypto.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${crypto.price.toLocaleString()}</p>
              <p
                className={`flex items-center justify-end gap-1 text-sm ${
                  crypto.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {crypto.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {crypto.isPositive ? "+" : ""}
                {crypto.change}%
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
