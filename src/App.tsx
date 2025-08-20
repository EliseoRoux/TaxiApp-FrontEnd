import { useState } from 'react';
import { ListaServicios } from './features/servicios/pages/ListaServicios';
import { ListaClientes } from './features/clientes/pages/ListaClientes';

type View = 'servicios' | 'clientes';

function App() {
  const [currentView, setCurrentView] = useState<View>('servicios');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('servicios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'servicios'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Servicios
            </button>
            <button
              onClick={() => setCurrentView('clientes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'clientes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clientes
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto py-6">
        {currentView === 'servicios' && <ListaServicios />}
        {currentView === 'clientes' && <ListaClientes />}
      </div>
    </div>
  );
}

export default App;