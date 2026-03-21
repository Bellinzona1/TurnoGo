import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import { courts, mockBookings, Booking, sportLabels, Sport } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { LogOut, LayoutDashboard, CalendarDays, Settings, Users, DollarSign, TrendingUp, Clock, Menu, X, Edit2, Save } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.png";

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
  const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState<Date>(new Date());
  const [editingCourt, setEditingCourt] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [showRevenueChart, setShowRevenueChart] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const totalRevenue = mockBookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.total, 0);
  const totalBookings = mockBookings.filter(b => b.status !== "cancelled").length;

  // Calculate revenue by date
  const revenueByDate = mockBookings
    .filter(b => b.status === "confirmed")
    .reduce((acc, b) => {
      const existing = acc.find(item => item.date === b.date);
      if (existing) {
        existing.total += b.total;
      } else {
        acc.push({ date: b.date, total: b.total });
      }
      return acc;
    }, [] as { date: string; total: number }[])
    .sort((a, b) => a.date.localeCompare(b.date));

  const navItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { key: "bookings", label: "Reservas", icon: <CalendarDays className="h-5 w-5" /> },
    { key: "courts", label: "Canchas", icon: <Settings className="h-5 w-5" /> },
  ];

  const sportBgColor: Record<Sport, string> = {
    football: "bg-brand-blue",
    padel: "bg-brand-green",
    tennis: "bg-brand-blue-dark",
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-brand-gray via-blue-50 to-brand-gray">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-brand-blue opacity-10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-brand-green opacity-10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-brand-blue-dark text-white flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 flex items-center gap-3 px-5 border-b border-brand-blue">
          <img src={logoImg} alt="TurnoGo Logo" className="h-[130px] w-auto" />
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
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                tab === item.key ? "bg-brand-green text-white" : "text-blue-100 hover:bg-brand-blue hover:text-white"
              )}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-brand-blue">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-brand-green flex items-center justify-center text-brand-blue-dark font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-blue-200">Admin</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-blue-200 hover:text-white">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-brand-gray flex items-center px-4 gap-3 sticky top-0 z-10 backdrop-blur-sm">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-brand-blue-dark" />
          </button>
          <h1 className="font-display font-bold text-brand-blue-dark capitalize">{tab === "dashboard" ? "Dashboard" : tab === "bookings" ? "Reservas" : "Canchas"}</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {tab === "dashboard" && (
            <div className="space-y-6 animate-fade-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card 
                  onClick={() => setShowRevenueChart(true)}
                  className="bg-white border-2 border-brand-gray hover:shadow-lg hover:border-brand-green transition-all cursor-pointer"
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-brand-green/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-brand-green" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-blue">Ingresos</p>
                      <p className="text-2xl font-display font-bold text-brand-blue-dark">${totalRevenue}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-2 border-brand-gray hover:shadow-lg transition-shadow">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                      <CalendarDays className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-blue">Reservas</p>
                      <p className="text-2xl font-display font-bold text-brand-blue-dark">{totalBookings}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-2 border-brand-gray hover:shadow-lg transition-shadow">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-brand-green/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-brand-green" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-blue">Clientes</p>
                      <p className="text-2xl font-display font-bold text-brand-blue-dark">4</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-2 border-brand-gray hover:shadow-lg transition-shadow">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-blue">Canchas</p>
                      <p className="text-2xl font-display font-bold text-brand-blue-dark">{courts.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent bookings */}
              <Card className="bg-white border-2 border-brand-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-brand-blue-dark">Reservas Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-brand-gray text-brand-blue">
                          <th className="text-left py-3 font-bold">Cliente</th>
                          <th className="text-left py-3 font-bold">Cancha</th>
                          <th className="text-left py-3 font-bold">Fecha</th>
                          <th className="text-left py-3 font-bold">Hora</th>
                          <th className="text-left py-3 font-bold">Estado</th>
                          <th className="text-right py-3 font-bold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBookings.map((b) => (
                          <tr key={b.id} className="border-b border-brand-gray/30 last:border-0 hover:bg-brand-gray/30 transition-colors">
                            <td className="py-3 font-semibold text-brand-blue-dark">{b.customerName}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", sportBgColor[b.sport])} />
                                <span className="text-brand-blue-dark">{b.courtName}</span>
                              </div>
                            </td>
                            <td className="py-3 text-brand-blue">{b.date}</td>
                            <td className="py-3 text-brand-blue">{b.time}</td>
                            <td className="py-3">
                              <Badge variant="outline" className={statusColors[b.status]}>{statusLabels[b.status]}</Badge>
                            </td>
                            <td className="py-3 text-right font-bold text-brand-blue-dark">${b.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Availability Calendar & Timeline */}
              <Card className="bg-white border-2 border-brand-gray shadow-lg">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-brand-blue-dark">Disponibilidad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Calendar */}
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedAvailabilityDate}
                      onSelect={(date) => date && setSelectedAvailabilityDate(date)}
                      className="bg-white border border-brand-gray rounded-lg p-3"
                    />
                  </div>

                  {/* Timeline for selected date */}
                  <div className="pt-4 border-t border-brand-gray">
                    <h3 className="font-semibold text-brand-blue-dark mb-4">
                      {selectedAvailabilityDate.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </h3>
                    <div className="overflow-x-auto">
                      <div className="min-w-[700px]">
                        {/* Hours header */}
                        <div className="flex mb-2">
                          <div className="w-40 shrink-0" />
                          {Array.from({ length: 15 }, (_, i) => i + 8).map((h) => (
                            <div key={h} className="flex-1 text-center text-xs text-brand-blue font-bold">
                              {h}:00
                            </div>
                          ))}
                        </div>
                        {/* Court rows */}
                        {courts.map((court) => {
                          const selectedDateStr = selectedAvailabilityDate.toISOString().split('T')[0];
                          const courtBookings = mockBookings.filter(b => b.courtId === court.id && b.date === selectedDateStr);
                          return (
                            <div key={court.id} className="flex items-center mb-1.5">
                              <div className="w-40 shrink-0 flex items-center gap-2 pr-3">
                                <span className={cn("w-2 h-2 rounded-full shrink-0", sportBgColor[court.sport])} />
                                <span className="text-xs font-bold text-brand-blue-dark truncate">{court.name}</span>
                              </div>
                              <div className="flex-1 flex bg-brand-gray/50 rounded h-8 relative">
                                {courtBookings.map((b) => {
                                  const hour = parseInt(b.time);
                                  const left = ((hour - 8) / 15) * 100;
                                  const width = (1 / 15) * 100;
                                  return (
                                    <div
                                      key={b.id}
                                      className={cn("absolute top-0.5 bottom-0.5 rounded text-xs flex items-center justify-center font-bold text-white", sportBgColor[b.sport])}
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
                  <Card key={court.id} className="bg-white border-2 border-brand-gray shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={cn("w-3 h-3 rounded-full", sportBgColor[court.sport])} />
                          <h3 className="font-display font-semibold text-brand-blue-dark">{court.name}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCourt(court);
                            setEditFormData({ ...court });
                          }}
                          className="text-brand-blue hover:bg-brand-blue/10"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {court.features.map((f) => (
                          <Badge key={f} variant="secondary" className="text-xs bg-brand-gray text-brand-blue-dark border-0">{f}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-brand-gray">
                        <span className="text-sm text-brand-blue">{sportLabels[court.sport]}</span>
                        <span className="font-display font-bold text-brand-green">${court.pricePerHour}/hr</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Court Dialog */}
      <Dialog open={!!editingCourt} onOpenChange={(open) => !open && setEditingCourt(null)}>
        <DialogContent className="sm:max-w-md bg-white border border-brand-gray">
          <DialogHeader>
            <DialogTitle className="text-brand-blue-dark">Editar Cancha</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-brand-blue-dark font-semibold">Nombre</Label>
                <Input
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="border-brand-gray focus:border-brand-green focus:ring-brand-green/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-blue-dark font-semibold">Precio por hora ($)</Label>
                <Input
                  type="number"
                  value={editFormData.pricePerHour}
                  onChange={(e) => setEditFormData({ ...editFormData, pricePerHour: parseInt(e.target.value) || 0 })}
                  className="border-brand-gray focus:border-brand-green focus:ring-brand-green/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-blue-dark font-semibold">Características</Label>
                <Input
                  value={editFormData.features.join(", ")}
                  onChange={(e) => setEditFormData({ ...editFormData, features: e.target.value.split(",").map(f => f.trim()) })}
                  className="border-brand-gray focus:border-brand-green focus:ring-brand-green/20"
                  placeholder="Separadas por comas"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingCourt(null)}
              className="border-brand-gray text-brand-blue-dark hover:bg-brand-gray/50"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                console.log("Cancha actualizada:", editFormData);
                setEditingCourt(null);
              }}
              className="bg-gradient-to-r from-brand-green to-brand-green-dark hover:from-brand-green-dark hover:to-brand-green text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revenue Chart Dialog */}
      <Dialog open={showRevenueChart} onOpenChange={setShowRevenueChart}>
        <DialogContent className="sm:max-w-2xl bg-white border border-brand-gray">
          <DialogHeader>
            <DialogTitle className="text-brand-blue-dark">Ingresos por Día</DialogTitle>
          </DialogHeader>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#3088E0"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#3088E0"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #3088E0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value}`, 'Ingresos']}
                />
                <Bar 
                  dataKey="total" 
                  fill="#2ECC71" 
                  radius={[8, 8, 0, 0]}
                  name="Ingresos"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
