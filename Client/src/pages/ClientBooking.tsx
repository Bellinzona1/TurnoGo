import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import { courts, Court, Sport, sportLabels, generateTimeSlots, TimeSlot } from "@/lib/data";
import { CourtCard } from "@/components/booking/CourtCard";
import { DateStrip } from "@/components/booking/DateStrip";
import { TimeGrid } from "@/components/booking/TimeGrid";
import { PaymentModal } from "@/components/booking/PaymentModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleDot, LogOut, ArrowLeft, ChevronRight } from "lucide-react";

type Step = "courts" | "schedule" | "payment";

export default function ClientBooking() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sportFilter, setSportFilter] = useState<Sport | "all">("all");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("courts");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  const filteredCourts = sportFilter === "all" ? courts : courts.filter((c) => c.sport === sportFilter);

  const handleSelectCourt = (court: Court) => {
    setSelectedCourt(court);
    setSelectedTime(null);
    setStep("schedule");
  };

  const handleBack = () => {
    if (step === "schedule") {
      setStep("courts");
      setSelectedCourt(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sportFilters: { key: Sport | "all"; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "football", label: "Fútbol" },
    { key: "padel", label: "Pádel" },
    { key: "tennis", label: "Tenis" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleDot className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-lg text-foreground">MatchPoint</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">Hola, {user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 text-muted-foreground">
              <LogOut className="h-4 w-4" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {step === "courts" && (
          <div className="animate-fade-up">
            <div className="mb-6">
              <h1 className="text-2xl font-display font-bold text-foreground mb-1">Reserva tu cancha</h1>
              <p className="text-muted-foreground">Selecciona una cancha para comenzar</p>
            </div>

            {/* Sport filters */}
            <div className="flex gap-2 mb-6">
              {sportFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSportFilter(f.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    sportFilter === f.key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-foreground border border-border hover:border-primary/50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Court grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourts.map((court) => (
                <CourtCard key={court.id} court={court} onSelect={handleSelectCourt} />
              ))}
            </div>
          </div>
        )}

        {step === "schedule" && selectedCourt && (
          <div className="animate-fade-up">
            <button onClick={handleBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Volver a canchas
            </button>

            <div className="lg:grid lg:grid-cols-3 lg:gap-6">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground mb-1">{selectedCourt.name}</h2>
                  <Badge variant="secondary">{sportLabels[selectedCourt.sport]}</Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Selecciona fecha</h3>
                  <DateStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                </div>

                <TimeGrid slots={timeSlots} selectedTime={selectedTime} onSelect={setSelectedTime} />
              </div>

              {/* Sticky summary sidebar */}
              <div className="mt-6 lg:mt-0">
                <div className="bg-card border border-border rounded-lg p-5 lg:sticky lg:top-20 space-y-4">
                  <h3 className="font-display font-semibold text-foreground">Resumen</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cancha</span>
                      <span className="font-medium">{selectedCourt.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha</span>
                      <span className="font-medium">{selectedDate.toLocaleDateString("es", { day: "numeric", month: "short" })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hora</span>
                      <span className="font-medium">{selectedTime || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duración</span>
                      <span className="font-medium">1 hora</span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="font-display font-semibold">Total</span>
                    <span className="text-2xl font-display font-bold text-primary">${selectedCourt.pricePerHour}</span>
                  </div>
                  <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold h-11 gap-2"
                    disabled={!selectedTime}
                    onClick={() => setPaymentOpen(true)}
                  >
                    Continuar al pago <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <PaymentModal
        open={paymentOpen}
        onClose={() => { setPaymentOpen(false); setStep("courts"); setSelectedCourt(null); setSelectedTime(null); }}
        court={selectedCourt}
        date={selectedDate}
        time={selectedTime}
      />
    </div>
  );
}
