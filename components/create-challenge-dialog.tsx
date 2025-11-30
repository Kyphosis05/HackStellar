"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trophy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreateChallengeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateChallengeDialog({ open, onOpenChange }: CreateChallengeDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [prize, setPrize] = useState("")
  const [duration, setDuration] = useState("7")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreate = async () => {
    const publicKey = localStorage.getItem("stellar_public_key")

    if (!publicKey) {
      toast({
        title: "Cüzdan Gerekli",
        description: "Challenge oluşturmak için cüzdanınızı bağlayın.",
        variant: "destructive",
      })
      return
    }

    if (!title || !description || !prize) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      // In production, this would create the challenge and lock the prize amount
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Challenge Oluşturuldu!",
        description: `${prize} XLM ödül havuzlu challenge başarıyla oluşturuldu.`,
      })

      setTitle("")
      setDescription("")
      setPrize("")
      setDuration("7")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Hata",
        description: "Challenge oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Challenge Oluştur
          </DialogTitle>
          <DialogDescription>Topluluk için yeni bir challenge başlatın ve ödül havuzu oluşturun</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Challenge Başlığı
            </Label>
            <Input
              id="title"
              placeholder="Örn: En İyi Video Challenge"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 border-border/50 bg-background"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Açıklama
            </Label>
            <Textarea
              id="description"
              placeholder="Challenge detaylarını ve kurallarını açıklayın..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-[100px] border-border/50 bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prize" className="text-sm font-medium">
                Ödül Havuzu (XLM)
              </Label>
              <Input
                id="prize"
                type="number"
                step="1"
                min="1"
                placeholder="100"
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                className="mt-1 border-border/50 bg-background"
              />
            </div>

            <div>
              <Label htmlFor="duration" className="text-sm font-medium">
                Süre (Gün)
              </Label>
              <Input
                id="duration"
                type="number"
                step="1"
                min="1"
                max="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 border-border/50 bg-background"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Challenge oluşturduğunuzda, ödül miktarı cüzdanınızdan kilitlenecek ve challenge bittiğinde kazanana
              otomatik olarak gönderilecektir.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border/50"
              disabled={isCreating}
            >
              İptal
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating || !title || !description || !prize}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isCreating ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
