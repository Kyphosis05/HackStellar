import { Navbar } from "@/components/navbar"
import { CryptoPrices } from "@/components/crypto-prices"
import { NewsSection } from "@/components/news-section"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Coins, Trophy, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              BLOCK<span className="text-primary">SOCIAL</span>
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
              Stellar blockchain üzerinde çalışan sosyal medya platformu. İçeriklerinizle coin kazanın, challenge'lara
              katılın ve kripto para ile ticaret yapın.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/feed">
                  Keşfetmeye Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Nasıl Çalışır?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-border/40">
        <div className="container">
          <CryptoPrices />
        </div>
      </section>

      <section className="py-12 border-b border-border/40">
        <div className="container">
          <NewsSection />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Öne Çıkan Özellikler</h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Blockchain teknolojisi ile desteklenen sosyal medya deneyimi
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/50 bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Coin ile Bağış</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Beğendiğiniz içerik üreticilerine doğrudan XLM ile bağış yapın
              </p>
            </Card>

            <Card className="border-border/50 bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Challenge'lar</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Yaratıcı challenge'lar oluşturun ve ödül havuzundan kazanın
              </p>
            </Card>

            <Card className="border-border/50 bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Coin Ticareti</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Marketplace'de coin alım-satımı yapın ve portföyünüzü büyütün
              </p>
            </Card>

            <Card className="border-border/50 bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Topluluk</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Kripto topluluğu ile bağlantı kurun ve birlikte büyüyün
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Stellar cüzdanınızı bağlayın ve başlayın
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Freighter veya diğer Stellar cüzdanlarınızı kullanarak hemen platformumuza katılın
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/feed">
                  Şimdi Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
