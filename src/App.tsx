// App.tsx
import { useState } from 'react';
import { ListaServicios } from './features/servicios/pages/ListaServicios';
import { ListaClientes } from './features/clientes/pages/ListaClientes';
import { ListaConductores } from './features/conductores/pages/ListaConductores';
import { ListaReservas } from './features/reservas/pages/ListaReservas'; // Nueva importación

type View = 'servicios' | 'clientes' | 'conductores' | 'reservas'; // Agregar reservas

function App() {
  const [currentView, setCurrentView] = useState<View>('servicios');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button onClick={() => setCurrentView('servicios')}>Servicios</button>
            <button onClick={() => setCurrentView('reservas')}>Reservas</button> {/* Nuevo botón */}
            <button onClick={() => setCurrentView('clientes')}>Clientes</button>
            <button onClick={() => setCurrentView('conductores')}>Conductores</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-6">
        {currentView === 'servicios' && <ListaServicios />}
        {currentView === 'reservas' && <ListaReservas />} {/* Nueva vista */}
        {currentView === 'clientes' && <ListaClientes />}
        {currentView === 'conductores' && <ListaConductores />}
      </div>
    </div>
  );
}

export default App;