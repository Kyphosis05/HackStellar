"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins } from "lucide-react"
import { sendPayment } from "@/lib/stellar"
import { useToast } from "@/hooks/use-toast"

interface DonateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipientPublicKey: string
  postId: string
  onSuccess?: () => void
}

export function DonateDialog({ open, onOpenChange, recipientPublicKey, postId, onSuccess }: DonateDialogProps) {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const quickAmounts = ["5", "10", "25", "50"]

  const handleDonate = async () => {
    const senderKey = localStorage.getItem("stellar_public_key")
    if (!senderKey) {
      toast({
        title: "Cüzdan Gerekli",
        description: "Bağış yapmak için cüzdanınızı bağlayın.",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Geçersiz Miktar",
        description: "Lütfen geçerli bir miktar girin.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      const memo = message ? `Donation: ${message}` : `Donation for post ${postId}`
      const success = await sendPayment(senderKey, recipientPublicKey, amount, memo)

      if (success) {
        toast({
          title: "Bağış Başarılı!",
          description: `${amount} XLM başarıyla gönderildi.`,
        })
        setAmount("")
        setMessage("")
        onOpenChange(false)
        onSuccess?.()
      } else {
        throw new Error("Payment failed")
      }
    } catch (error) {
      toast({
        title: "Bağış Hatası",
        description: "Bağış gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Bağış Yap
          </DialogTitle>
          <DialogDescription>İçerik üreticisine XLM ile bağış yapın</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="recipient" className="text-sm font-medium">
              Alıcı
            </Label>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {recipientPublicKey.slice(0, 8)}...{recipientPublicKey.slice(-8)}
            </p>
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm font-medium">
              Miktar (XLM)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.1"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 border-border/50 bg-background"
            />
          </div>

          <div className="flex gap-2">
            {quickAmounts.map((qa) => (
              <Button
                key={qa}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(qa)}
                className="flex-1 border-border/50"
              >
                {qa} XLM
              </Button>
            ))}
          </div>

          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Mesaj (Opsiyonel)
            </Label>
            <Input
              id="message"
              placeholder="Destek mesajı..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={28}
              className="mt-1 border-border/50 bg-background"
            />
            <p className="mt-1 text-xs text-muted-foreground">{message.length}/28 karakter</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border/50"
              disabled={isSending}
            >
              İptal
            </Button>
            <Button
              onClick={handleDonate}
              disabled={isSending || !amount}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSending ? "Gönderiliyor..." : "Bağış Yap"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
