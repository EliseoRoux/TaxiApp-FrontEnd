// Importa hooks de React
import { useEffect, useState } from 'react'
// Importa la función para obtener servicios
import { getServicios } from '../../api/servicioAPI'
// Importa el tipo Servicio
import type { Servicio } from '../../types/servicio'

// Componente principal que muestra la lista de servicios
export function ListaServicios() {
  // Estado para almacenar los servicios:
  const [servicios, setServicios] = useState<Servicio[]>([])
  // Estado para manejar el loading:
  const [loading, setLoading] = useState(true)

  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    // Función asíncrona para cargar servicios
    const loadServicios = async () => {
      try {
        // Obtenemos servicios de la API
        const data = await getServicios()
        // Actualizamos el estado con los datos
        setServicios(data)
      } catch (error) {
        // Manejo de errores
        console.error('Error cargando servicios:', error)
      } finally {
        // Quita el estado de loading tanto en éxito como en error
        setLoading(false)
      }
    }
    
    // Ejecutamos la función
    loadServicios()
  }, []) // Array vacío significa que solo se ejecuta una vez

  // Muestra spinner mientras carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Renderizado principal
  return (
    <div className="container mx-auto p-4">
      {/* Título */}
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Servicios de Taxi</h1>
      
      {/* Grid de servicios */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Mapeamos cada servicio a un elemento JSX */}
        {servicios.map(servicio => (
          <div 
            key={servicio.id_servicio} // Key única para React
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
          >
            {/* Ruta del servicio */}
            <h2 className="text-xl font-semibold">
              {servicio.origen} → {servicio.destino}
            </h2>
            
            {/* Información del conductor */}
            {servicio.conductor && (
              <div className="mt-2">
                <p className="text-gray-600">
                  Conductor: {servicio.conductor.nombre}
                </p>
                <p className="text-sm text-gray-500">
                  Tel: {servicio.conductor.telefono}
                </p>
              </div>
            )}
            
            {/* Precio */}
            <p className="text-green-600 font-bold mt-2">
              Precio: ${servicio.precio.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}