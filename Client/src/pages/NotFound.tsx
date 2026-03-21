import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-gray via-blue-50 to-brand-gray relative">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-brand-blue opacity-10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-brand-green opacity-10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="text-center bg-white rounded-2xl p-12 shadow-2xl max-w-md relative z-10">
        <h1 className="mb-4 text-6xl font-bold text-brand-blue-dark">404</h1>
        <p className="mb-4 text-xl text-brand-blue font-semibold">Oops! Página no encontrada</p>
        <p className="mb-6 text-gray-600">La página que buscas no existe</p>
        <a href="/" className="inline-block bg-gradient-to-r from-brand-green to-brand-green-dark text-white font-bold py-2.5 px-6 rounded-lg hover:from-brand-green-dark hover:to-brand-green transition-all shadow-lg">
          Volver al Inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
