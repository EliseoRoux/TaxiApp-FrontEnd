// Importa el componente ListaServicios
import { ListaServicios } from './features/servicios/pages/ListaServicios'

// Componente principal de la aplicación
function App() {
  return (
    // Contenedor principal con estilo de Tailwind:
    // - min-h-screen: ocupa al menos el 100% del alto de la pantalla
    // - bg-gray-50: fondo gris claro
    <div className="min-h-screen bg-gray-50">
      {/* Renderiza el componente ListaServicios */}
      <ListaServicios />
    </div>
  )
}

export default App