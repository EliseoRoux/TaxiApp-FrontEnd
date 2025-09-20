import { useState } from "react";
import ListaServicios from "./features/servicios/pages/ListaServicios";
import ListaClientes from "./features/clientes/pages/ListaClientes";
import ListaConductores from "./features/conductores/pages/ListaConductores";
import ListaReservas from "./features/reservas/pages/ListaReservas";
import ListaDeudas from "./features/conductores/pages/ListaDeudas";
import { ListaConductoresSinDeuda } from "./features/conductores/pages/ListaConductoresSinDeuda";
import FiltroServiciosPorConductor from "./features/servicios/pages/FiltroServiciosPorConductor";
import FiltroReservasPorConductor from "./features/reservas/pages/FiltroReservasPorConductor";
import HistorialConductor from "./features/historial/pages/HistorialConductor";

type View =
  | "servicios"
  | "clientes"
  | "conductores"
  | "reservas"
  | "deudas"
  | "sinDeuda"
  | "serviciosFiltrados"
  | "reservasFiltradas"
  | "historial";

function App() {
  const [currentView, setCurrentView] = useState<View>("servicios");

  // Componente reutilizable para los botones de navegación
  const NavButton = ({
    view,
    children,
  }: {
    view: View;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        currentView === view
          ? "bg-blue-600 text-white shadow-sm" // Estilo para el botón activo
          : "text-gray-700 hover:bg-gray-100" // Estilo para inactivos
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado fijo con sombra */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 py-3">
            <NavButton view="servicios">Servicios</NavButton>
            <NavButton view="reservas">Reservas</NavButton>
            <NavButton view="clientes">Clientes</NavButton>
            <NavButton view="conductores">Conductores</NavButton>
            <NavButton view="deudas">Deudas</NavButton>
            <NavButton view="sinDeuda">Sin Deuda</NavButton>
            <NavButton view="serviciosFiltrados">
              Servicios por Conductor
            </NavButton>
            <NavButton view="reservasFiltradas">
              Reservas por Conductor
            </NavButton>
            <NavButton view="historial">Historial</NavButton>
          </div>
        </nav>
      </header>

      {/* Contenido principal con un padding consistente */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === "servicios" && <ListaServicios />}
        {currentView === "reservas" && <ListaReservas />}
        {currentView === "clientes" && <ListaClientes />}
        {currentView === "conductores" && <ListaConductores />}
        {currentView === "deudas" && <ListaDeudas />}
        {currentView === "sinDeuda" && <ListaConductoresSinDeuda />}
        {currentView === "serviciosFiltrados" && (
          <FiltroServiciosPorConductor />
        )}
        {currentView === "reservasFiltradas" && <FiltroReservasPorConductor />}
        {currentView === "historial" && <HistorialConductor />}
      </main>
    </div>
  );
}

export default App;
