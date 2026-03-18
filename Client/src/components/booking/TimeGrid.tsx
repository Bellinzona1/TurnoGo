import { TimeSlot } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimeGridProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeGrid({ slots, selectedTime, onSelect }: TimeGridProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Horarios disponibles</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.time}
            disabled={!slot.available}
            onClick={() => onSelect(slot.time)}
            className={cn(
              "py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-200 border",
              !slot.available && "bg-muted text-muted-foreground/40 border-transparent cursor-not-allowed line-through",
              slot.available && slot.time !== selectedTime && "bg-card text-foreground border-border hover:border-primary hover:bg-primary/5",
              slot.time === selectedTime && "bg-primary text-primary-foreground border-primary shadow-sm"
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-card border border-border" /> Disponible</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary" /> Seleccionado</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-muted" /> Ocupado</span>
      </div>
    </div>
  );
}
