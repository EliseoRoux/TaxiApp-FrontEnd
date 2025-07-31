// Importa la función createClient de la biblioteca de Supabase
import { createClient } from '@supabase/supabase-js'

// Obtiene la URL de Supabase desde las variables de entorno
// El ! indica que estamos seguros que esta variable existe
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// Obtiene la clave anónima de Supabase desde las variables de entorno
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificación de que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno para Supabase')
}

// Crea y exporta el cliente de Supabase configurado con la URL y clave
export const supabase = createClient(supabaseUrl, supabaseKey)