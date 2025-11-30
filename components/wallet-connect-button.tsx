"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { connectFreighter, getWalletBalance } from "@/lib/stellar"
import { Wallet, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function WalletConnectButton() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if wallet is already connected
    const savedKey = localStorage.getItem("stellar_public_key")
    if (savedKey) {
      setPublicKey(savedKey)
      loadBalance(savedKey)
    }
  }, [])

  const loadBalance = async (key: string) => {
    const bal = await getWalletBalance(key)
    setBalance(bal)
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const key = await connectFreighter()
      if (key) {
        setPublicKey(key)
        localStorage.setItem("stellar_public_key", key)
        await loadBalance(key)

        toast({
          title: "Wallet Connected",
          description: "Your Stellar wallet has been connected successfully!",
        })
      } else {
        toast({
          title: "Freighter Wallet Required",
          description: "Please install Freighter wallet extension to continue.",
          variant: "destructive",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://www.freighter.app/", "_blank")}
              className="gap-2"
            >
              Install Freighter <ExternalLink className="h-3 w-3" />
            </Button>
          ),
        })
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please install Freighter wallet to use this platform.",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://www.freighter.app/", "_blank")}
            className="gap-2"
          >
            Install Freighter <ExternalLink className="h-3 w-3" />
          </Button>
        ),
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setPublicKey(null)
    setBalance("0")
    localStorage.removeItem("stellar_public_key")
    toast({
      title: "Wallet Disconnected",
      description: "Your Stellar wallet has been disconnected.",
    })
  }

  if (publicKey) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-mono text-muted-foreground">
            {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
          </span>
          <span className="text-xs text-primary font-semibold">{Number.parseFloat(balance).toFixed(2)} XLM</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleDisconnect} className="border-border/50 bg-transparent">
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Stellar Wallet"}
    </Button>
  )
}
