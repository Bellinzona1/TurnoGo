import { Court, sportLabels } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign } from "lucide-react";
import courtFootball from "@/assets/court-football.jpg";
import courtPadel from "@/assets/court-padel.jpg";
import courtTennis from "@/assets/court-tennis.jpg";

const images: Record<string, string> = {
  football: courtFootball,
  padel: courtPadel,
  tennis: courtTennis,
};

const sportColors: Record<string, string> = {
  football: "bg-sport-football",
  padel: "bg-sport-padel",
  tennis: "bg-sport-tennis",
};

interface CourtCardProps {
  court: Court;
  onSelect: (court: Court) => void;
}

export function CourtCard({ court, onSelect }: CourtCardProps) {
  return (
    <Card className="overflow-hidden glass-card group hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => onSelect(court)}>
      <div className="relative h-44 overflow-hidden">
        <img
          src={images[court.image]}
          alt={court.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className={`absolute top-3 left-3 ${sportColors[court.sport]} text-primary-foreground border-0`}>
          {sportLabels[court.sport]}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-display font-semibold text-foreground text-lg">{court.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          {court.features.map((f) => (
            <Badge key={f} variant="secondary" className="text-xs font-normal">
              {f}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="flex items-center gap-1 text-foreground font-bold text-lg">
            <DollarSign className="h-4 w-4" />{court.pricePerHour}
            <span className="text-muted-foreground font-normal text-sm">/hora</span>
          </span>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
