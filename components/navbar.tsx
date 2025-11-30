import Link from "next/link"
import { WalletConnectButton } from "./wallet-connect-button"
import { Coins } from "lucide-react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Coins className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            BLOCK<span className="text-primary">SOCIAL</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Anasayfa
          </Link>
          <Link href="/feed" className="text-sm font-medium transition-colors hover:text-primary">
            Feed
          </Link>
          <Link href="/challenges" className="text-sm font-medium transition-colors hover:text-primary">
            Challenge
          </Link>
          <Link href="/marketplace" className="text-sm font-medium transition-colors hover:text-primary">
            Market
          </Link>
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  )
}
