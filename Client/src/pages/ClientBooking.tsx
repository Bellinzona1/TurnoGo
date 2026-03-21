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
import { LogOut, ArrowLeft, ChevronRight } from "lucide-react";
import logoImg from "@/assets/logo.png";

type Step = "courts" | "schedule" | "payment";

export default function ClientBooking() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sportFilter, setSportFilter] = useState<Sport | "all">("all");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("courts");
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
    } else if (step === "payment") {
      setStep("schedule");
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
    <div className="min-h-screen bg-gradient-to-br from-brand-gray via-blue-50 to-brand-gray">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-brand-blue opacity-10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-brand-green opacity-10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      {/* Header */}
      <header className="bg-white border-b border-brand-gray sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="TurnoGo Logo"
              className="w-auto h-10 sm:h-14 md:h-20 lg:h-32 xl:h-40"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">Hola, {user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 text-gray-600 hover:text-brand-blue">
              <LogOut className="h-4 w-4" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 relative z-20">
        {step === "courts" && (
          <div className="animate-fade-up">
            <div className="mb-6">
              <h1 className="text-3xl font-display font-bold text-brand-blue-dark mb-1">Reserva tu cancha</h1>
              <p className="text-brand-blue">Selecciona una cancha para comenzar</p>
            </div>

            {/* Sport filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {sportFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSportFilter(f.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    sportFilter === f.key
                      ? "bg-gradient-to-r from-brand-green to-brand-green-dark text-white shadow-lg shadow-green-300/40"
                      : "bg-white text-brand-blue-dark border-2 border-brand-gray hover:border-brand-blue hover:bg-blue-50"
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
            <button onClick={handleBack} className="flex items-center gap-1 text-sm text-brand-blue hover:text-brand-blue-dark mb-4 transition-colors font-semibold">
              <ArrowLeft className="h-4 w-4" /> Volver a canchas
            </button>

            <div className="lg:grid lg:grid-cols-3 lg:gap-6">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-brand-blue-dark mb-2">{selectedCourt.name}</h2>
                  <Badge variant="secondary" className="bg-brand-green text-white border-0 font-semibold">{sportLabels[selectedCourt.sport]}</Badge>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-brand-blue-dark mb-3">Selecciona fecha</h3>
                  <DateStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                </div>

                <TimeGrid slots={timeSlots} selectedTime={selectedTime} onSelect={setSelectedTime} />
              </div>

              {/* Sticky summary sidebar */}
              <div className="mt-6 lg:mt-0">
                <div className="bg-white border-2 border-brand-gray rounded-xl p-5 lg:sticky lg:top-20 space-y-4 shadow-lg">
                  <h3 className="font-display font-bold text-brand-blue-dark">Resumen</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-green font-semibold">Cancha</span>
                      <span className="font-semibold text-brand-blue-dark">{selectedCourt.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-green font-semibold">Fecha</span>
                      <span className="font-semibold text-brand-blue-dark">{selectedDate.toLocaleDateString("es", { day: "numeric", month: "short" })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-green font-semibold">Hora</span>
                      <span className="font-semibold text-brand-blue-dark">{selectedTime || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-green font-semibold">Duración</span>
                      <span className="font-semibold text-brand-blue-dark">1 hora</span>
                    </div>
                  </div>
                  <div className="border-t-2 border-brand-gray pt-3 flex justify-between items-center">
                    <span className="font-display font-bold text-brand-blue-dark">Total</span>
                    <span className="text-2xl font-display font-bold text-brand-green">${selectedCourt.pricePerHour}</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-brand-green to-brand-green-dark hover:from-brand-green-dark hover:to-brand-green text-white font-bold h-11 gap-2 shadow-lg shadow-green-300/40"
                    disabled={!selectedTime}
                    onClick={() => setStep("payment")}
                  >
                    Continuar al pago <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === "payment" && selectedCourt && (
          <div className="animate-fade-up">
            <button onClick={handleBack} className="flex items-center gap-1 text-sm text-brand-blue hover:text-brand-blue-dark mb-6 transition-colors font-semibold">
              <ArrowLeft className="h-4 w-4" /> Volver
            </button>

            <div className="flex justify-center">
              <PaymentModal
                court={selectedCourt}
                date={selectedDate}
                time={selectedTime}
              />
            </div>
          </div>
        )}
      </main>

      {/* Remove old PaymentModal component usage */}
    </div>
  );
}
