// Importa el cliente de Supabase configurado
import { supabase } from '../lib/supabaseClient'
// Importa el tipo Servicio (usando type-only import)
import type { Servicio } from '../types/servicio'

// Función para obtener todos los servicios
export const getServicios = async (): Promise<Servicio[]> => {
  // Realiza la consulta a Supabase:
  const { data, error } = await supabase
    .from('servicio')  // Selecciona la tabla 'servicio'
    .select(`
      id_servicio,    // Campos a seleccionar:
      origen,         // - Origen del viaje
      destino,        // - Destino del viaje
      precio,         // - Precio del servicio
      conductor: id_conductor (nombre, telefono)  // Relación con tabla conductores
    `)

  // Si hay error, lo lanzamos para manejarlo después
  if (error) throw error
  
  // Convertimos y retornamos los datos con el tipo Servicio
  return data as unknown as Servicio[]
}

// Función para crear un nuevo servicio
export const createServicio = async (servicio: Omit<Servicio, 'id_servicio'>) => {
  // Omit<Servicio, 'id_servicio'> significa que recibimos un objeto Servicio sin el id
  const { data, error } = await supabase
    .from('servicio')  // Tabla donde insertaremos
    .insert(servicio)  // Datos a insertar
    .select()          // Devuelve el registro insertado

  if (error) throw error
  return data  // Retorna los datos del servicio creado
}