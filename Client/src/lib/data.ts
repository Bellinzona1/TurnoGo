export type Sport = "football" | "padel" | "tennis";

export interface Court {
  id: string;
  name: string;
  sport: Sport;
  pricePerHour: number;
  image: string;
  features: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  sport: Sport;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  status: "confirmed" | "pending" | "cancelled";
  total: number;
}

export const courts: Court[] = [
  { id: "f1", name: "Cancha Fútbol 5 - A", sport: "football", pricePerHour: 50, image: "football", features: ["Césped sintético", "Iluminación LED", "Vestuarios"] },
  { id: "f2", name: "Cancha Fútbol 7 - B", sport: "football", pricePerHour: 70, image: "football", features: ["Césped sintético", "Iluminación LED", "Tribunas"] },
  { id: "p1", name: "Cancha Pádel 1", sport: "padel", pricePerHour: 40, image: "padel", features: ["Cristal templado", "Iluminación LED", "Climatizada"] },
  { id: "p2", name: "Cancha Pádel 2", sport: "padel", pricePerHour: 40, image: "padel", features: ["Cristal templado", "Iluminación LED", "Climatizada"] },
  { id: "t1", name: "Cancha Tenis - Central", sport: "tennis", pricePerHour: 60, image: "tennis", features: ["Superficie dura", "Iluminación profesional", "Graderías"] },
  { id: "t2", name: "Cancha Tenis - Lateral", sport: "tennis", pricePerHour: 45, image: "tennis", features: ["Superficie clay", "Iluminación LED"] },
];

export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let h = 8; h <= 22; h++) {
    slots.push({
      time: `${h.toString().padStart(2, "0")}:00`,
      available: Math.random() > 0.3,
    });
  }
  return slots;
};

export const sportLabels: Record<Sport, string> = {
  football: "Fútbol",
  padel: "Pádel",
  tennis: "Tenis",
};

export const mockBookings: Booking[] = [
  { id: "b1", courtId: "f1", courtName: "Cancha Fútbol 5 - A", sport: "football", date: "2026-03-18", time: "10:00", customerName: "Juan Pérez", customerEmail: "juan@email.com", status: "confirmed", total: 50 },
  { id: "b2", courtId: "p1", courtName: "Cancha Pádel 1", sport: "padel", date: "2026-03-18", time: "14:00", customerName: "María García", customerEmail: "maria@email.com", status: "confirmed", total: 40 },
  { id: "b3", courtId: "t1", courtName: "Cancha Tenis - Central", sport: "tennis", date: "2026-03-18", time: "16:00", customerName: "Carlos López", customerEmail: "carlos@email.com", status: "pending", total: 60 },
  { id: "b4", courtId: "f2", courtName: "Cancha Fútbol 7 - B", sport: "football", date: "2026-03-19", time: "18:00", customerName: "Ana Martínez", customerEmail: "ana@email.com", status: "confirmed", total: 70 },
  { id: "b5", courtId: "p2", courtName: "Cancha Pádel 2", sport: "padel", date: "2026-03-19", time: "09:00", customerName: "Luis Rodríguez", customerEmail: "luis@email.com", status: "cancelled", total: 40 },
];
