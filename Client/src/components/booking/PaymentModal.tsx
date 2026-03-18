import { Court, sportLabels } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, CreditCard, Calendar, Clock, MapPin } from "lucide-react";
import { useState } from "react";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  court: Court | null;
  date: Date | null;
  time: string | null;
}

export function PaymentModal({ open, onClose, court, date, time }: PaymentModalProps) {
  const [paid, setPaid] = useState(false);

  if (!court || !date || !time) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaid(true);
  };

  const handleClose = () => {
    setPaid(false);
    onClose();
  };

  if (paid) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center py-8 text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">¡Reserva Confirmada!</h2>
            <p className="text-muted-foreground">
              Tu reserva en <strong>{court.name}</strong> el{" "}
              {date.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })} a las {time} ha sido confirmada.
            </p>
            <Button onClick={handleClose} className="mt-2">Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Confirmar Reserva</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{court.name}</span>
              <span className="text-muted-foreground">({sportLabels[court.sport]})</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{date.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{time} - {parseInt(time)}:00 (1 hora)</span>
            </div>
          </div>

          <Separator />

          <form onSubmit={handlePay} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre en la tarjeta</Label>
              <Input placeholder="Juan Pérez" required />
            </div>
            <div className="space-y-2">
              <Label>Número de tarjeta</Label>
              <Input placeholder="4242 4242 4242 4242" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Vencimiento</Label>
                <Input placeholder="MM/AA" required />
              </div>
              <div className="space-y-2">
                <Label>CVV</Label>
                <Input placeholder="123" required />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between font-display">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">${court.pricePerHour}</span>
            </div>

            <Button type="submit" className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base gap-2">
              <CreditCard className="h-5 w-5" /> Pagar ${court.pricePerHour}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
