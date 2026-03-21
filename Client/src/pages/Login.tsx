import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoImg from "@/assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "admin">("client");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password, role)) {
      navigate(role === "admin" ? "/admin" : "/book");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f2f2] via-blue-50 to-[#f2f2f2] relative">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#3088E0] opacity-10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-[#2ECC71] opacity-10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      {/* Header - Fixed positioning */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-center px-4 pt-8 z-10">
        <img src={logoImg} alt="TurnoGo Logo" className="h-96 w-auto max-w-[60%]" />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-between min-h-screen px-[20%] pt-44 relative z-20">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex w-1/2 justify-center items-center">
          <div className="relative w-full max-w-xl">
            <img 
              src={import.meta.env.VITE_BASE_URL ? `/assets/Foto-inicio.png` : new URL('../assets/Foto-inicio.png', import.meta.url).href}
              alt="Tennis illustration" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto lg:ml-auto lg:mr-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            {/* Title */}
            <h2 className="text-3xl font-bold text-[#1D3B53] mb-2">Reserva tu cancha en segundos</h2>
            <p className="text-[#3088E0] text-sm font-medium mb-8">Inicia sesión en tu cuenta</p>

            {/* Role Selection */}
            <div className="flex gap-3 mb-8">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  role === "client"
                    ? "bg-gradient-to-r from-[#2ECC71] to-[#27AE5E] text-white shadow-lg shadow-green-300/50"
                    : "border-2 border-[#f2f2f2] text-[#1D3B53] bg-white hover:border-[#3088E0] hover:bg-blue-50"
                }`}
              >
                👤 Cliente
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  role === "admin"
                    ? "bg-gradient-to-r from-[#3088E0] to-[#1D3B53] text-white shadow-lg shadow-blue-300/50"
                    : "border-2 border-[#f2f2f2] text-[#1D3B53] bg-white hover:border-[#3088E0] hover:bg-blue-50"
                }`}
              >
                ⚙️ Admin
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="block text-sm font-semibold text-[#1D3B53] mb-3">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#f2f2f2] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2ECC71] focus:ring-2 focus:ring-green-200 transition-all"
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-semibold text-[#1D3B53] mb-3">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#f2f2f2] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2ECC71] focus:ring-2 focus:ring-green-200 transition-all"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#2ECC71] to-[#27AE5E] hover:from-[#27AE5E] hover:to-[#229954] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-300/40 hover:shadow-green-300/60"
              >
                Iniciar Sesión
              </Button>
            </form>

            {/* Forgot Password Link */}
            <p className="text-center mt-6 text-sm text-gray-600">
              <a href="#" className="text-[#3088E0] hover:text-[#1D3B53] font-semibold transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
