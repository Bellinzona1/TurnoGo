import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import { courts, mockBookings, Booking, sportLabels, Sport } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDot, LogOut, LayoutDashboard, CalendarDays, Settings, Users, DollarSign, TrendingUp, Clock, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "bookings" | "courts";

const statusColors: Record<string, string> = {
  confirmed: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-accent/10 text-accent border-accent/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels: Record<string, string> = {
  confirmed: "Confirmada",
  pending: "Pendiente",
  cancelled: "Cancelada",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const totalRevenue = mockBookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.total, 0);
  const totalBookings = mockBookings.filter(b => b.status !== "cancelled").length;

  const navItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { key: "bookings", label: "Reservas", icon: <CalendarDays className="h-5 w-5" /> },
    { key: "courts", label: "Canchas", icon: <Settings className="h-5 w-5" /> },
  ];

  const sportBgColor: Record<Sport, string> = {
    football: "bg-sport-football",
    padel: "bg-sport-padel",
    tennis: "bg-sport-tennis",
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-secondary text-secondary-foreground flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 flex items-center gap-2 px-5 border-b border-sidebar-border">
          <CircleDot className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-lg">MatchPoint</span>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setTab(item.key); setSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                tab === item.key ? "bg-sidebar-accent text-primary" : "text-secondary-foreground/70 hover:bg-sidebar-accent/50 hover:text-secondary-foreground"
              )}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-secondary-foreground/50">Admin</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-secondary-foreground/50 hover:text-secondary-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-foreground/20 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-3 sticky top-0 z-10">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="font-display font-semibold text-foreground capitalize">{tab === "dashboard" ? "Dashboard" : tab === "bookings" ? "Reservas" : "Canchas"}</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {tab === "dashboard" && (
            <div className="space-y-6 animate-fade-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-card">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ingresos</p>
                      <p className="text-2xl font-display font-bold">${totalRevenue}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <CalendarDays className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reservas</p>
                      <p className="text-2xl font-display font-bold">{totalBookings}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-sport-padel/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-sport-padel" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Clientes</p>
                      <p className="text-2xl font-display font-bold">4</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Canchas</p>
                      <p className="text-2xl font-display font-bold">{courts.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent bookings */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Reservas Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="text-left py-3 font-medium">Cliente</th>
                          <th className="text-left py-3 font-medium">Cancha</th>
                          <th className="text-left py-3 font-medium">Fecha</th>
                          <th className="text-left py-3 font-medium">Hora</th>
                          <th className="text-left py-3 font-medium">Estado</th>
                          <th className="text-right py-3 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBookings.map((b) => (
                          <tr key={b.id} className="border-b border-border/50 last:border-0">
                            <td className="py-3 font-medium text-foreground">{b.customerName}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", sportBgColor[b.sport])} />
                                {b.courtName}
                              </div>
                            </td>
                            <td className="py-3 text-muted-foreground">{b.date}</td>
                            <td className="py-3 text-muted-foreground">{b.time}</td>
                            <td className="py-3">
                              <Badge variant="outline" className={statusColors[b.status]}>{statusLabels[b.status]}</Badge>
                            </td>
                            <td className="py-3 text-right font-medium">${b.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Disponibilidad Hoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[700px]">
                      {/* Hours header */}
                      <div className="flex mb-2">
                        <div className="w-40 shrink-0" />
                        {Array.from({ length: 15 }, (_, i) => i + 8).map((h) => (
                          <div key={h} className="flex-1 text-center text-xs text-muted-foreground font-medium">
                            {h}:00
                          </div>
                        ))}
                      </div>
                      {/* Court rows */}
                      {courts.map((court) => {
                        const courtBookings = mockBookings.filter(b => b.courtId === court.id && b.date === "2026-03-18");
                        return (
                          <div key={court.id} className="flex items-center mb-1.5">
                            <div className="w-40 shrink-0 flex items-center gap-2 pr-3">
                              <span className={cn("w-2 h-2 rounded-full shrink-0", sportBgColor[court.sport])} />
                              <span className="text-xs font-medium truncate">{court.name}</span>
                            </div>
                            <div className="flex-1 flex bg-muted/50 rounded h-8 relative">
                              {courtBookings.map((b) => {
                                const hour = parseInt(b.time);
                                const left = ((hour - 8) / 15) * 100;
                                const width = (1 / 15) * 100;
                                return (
                                  <div
                                    key={b.id}
                                    className={cn("absolute top-0.5 bottom-0.5 rounded text-xs flex items-center justify-center font-medium", sportBgColor[b.sport], "text-primary-foreground")}
                                    style={{ left: `${left}%`, width: `${width}%` }}
                                    title={`${b.customerName} - ${b.time}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "bookings" && (
            <div className="animate-fade-up">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Todas las Reservas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="text-left py-3 font-medium">ID</th>
                          <th className="text-left py-3 font-medium">Cliente</th>
                          <th className="text-left py-3 font-medium">Email</th>
                          <th className="text-left py-3 font-medium">Cancha</th>
                          <th className="text-left py-3 font-medium">Fecha</th>
                          <th className="text-left py-3 font-medium">Hora</th>
                          <th className="text-left py-3 font-medium">Estado</th>
                          <th className="text-right py-3 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBookings.map((b) => (
                          <tr key={b.id} className="border-b border-border/50 last:border-0">
                            <td className="py-3 text-muted-foreground font-mono text-xs">{b.id}</td>
                            <td className="py-3 font-medium text-foreground">{b.customerName}</td>
                            <td className="py-3 text-muted-foreground">{b.customerEmail}</td>
                            <td className="py-3">{b.courtName}</td>
                            <td className="py-3 text-muted-foreground">{b.date}</td>
                            <td className="py-3 text-muted-foreground">{b.time}</td>
                            <td className="py-3"><Badge variant="outline" className={statusColors[b.status]}>{statusLabels[b.status]}</Badge></td>
                            <td className="py-3 text-right font-medium">${b.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "courts" && (
            <div className="animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courts.map((court) => (
                  <Card key={court.id} className="glass-card">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={cn("w-3 h-3 rounded-full", sportBgColor[court.sport])} />
                        <h3 className="font-display font-semibold">{court.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {court.features.map((f) => (
                          <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-sm text-muted-foreground">{sportLabels[court.sport]}</span>
                        <span className="font-display font-bold text-primary">${court.pricePerHour}/hr</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
