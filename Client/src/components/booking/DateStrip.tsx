import { useState } from "react";
import { cn } from "@/lib/utils";

interface DateStripProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export function DateStrip({ onDateSelect, selectedDate }: DateStripProps) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {days.map((day) => {
        const isSelected = day.toDateString() === selectedDate.toDateString();
        return (
          <button
            key={day.toISOString()}
            onClick={() => onDateSelect(day)}
            className={cn(
              "flex flex-col items-center min-w-[60px] py-3 px-3 rounded-lg transition-all duration-200 border",
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-foreground border-border hover:border-primary/50"
            )}
          >
            <span className="text-xs font-medium opacity-80">{dayNames[day.getDay()]}</span>
            <span className="text-lg font-display font-bold">{day.getDate()}</span>
            <span className="text-xs opacity-60">
              {day.toLocaleDateString("es", { month: "short" })}
            </span>
          </button>
        );
      })}
    </div>
  );
}
