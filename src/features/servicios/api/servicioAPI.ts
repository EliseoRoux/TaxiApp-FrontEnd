import { supabase } from "../../../lib/supabaseClient";
import type { Servicio, ServicioDB, ServicioFormData } from "../types/servicio";

// Función para transformar los datos de Supabase
const transformServicio = (servicioDB: ServicioDB): Servicio => ({
  id_servicio: servicioDB.id_servicio,
  origen: servicioDB.origen,
  destino: servicioDB.destino,
  precio: servicioDB.precio,
  fecha: servicioDB.fecha,
  eurotaxi: servicioDB.eurotaxi,
  hora: servicioDB.hora,
  nPersona: servicioDB.n_persona, // Mapeo explícito
  precio10: servicioDB.precio_10, // Mapeo explícito
  requisitos: servicioDB.requisitos,
  conductor: servicioDB.conductor?.[0],
  cliente: servicioDB.cliente?.[0],
});

export const fetchServicios = async (): Promise<Servicio[]> => {
  const { data, error } = await supabase
    .from("servicio")
    .select(
      `
      id_servicio,
      origen,
      destino,
      precio,
      fecha,
      eurotaxi,
      hora,
      n_persona,
      precio_10,
      requisitos,
      conductor: id_conductor (id_conductor, nombre, telefono),
      cliente: id_cliente (id_cliente, nombre)
    `
    )
    .order("fecha", { ascending: false });

  if (error) throw new Error(error.message);
  return data
    ? data.map((item) => ({
        ...item,
        nPersona: item.n_persona, // Mapea n_persona a nPersonas
        precio10: item.precio_10, // Mapea precio_10 a precio10
        conductor: item.conductor?.[0],
        cliente: item.cliente?.[0],
      }))
    : [];
};

// Las demás funciones (create, update, delete) se mantienen igual

/**
 * Crea un nuevo servicio
 */
export const createServicio = async (
  servicio: ServicioFormData
): Promise<Servicio> => {
  // Convertimos los nombres camelCase a snake_case para Supabase
  const servicioDB = {
    ...servicio,
    n_persona: servicio.nPersona,
    precio_10: servicio.precio10,
  };

  const { data, error } = await supabase
    .from("servicio")
    .insert(servicioDB)
    .select(
      `
      id_servicio,
      origen,
      destino,
      precio,
      fecha,
      eurotaxi,
      hora,
      n_persona,
      precio_10,
      requisitos,
      conductor: id_conductor (id_conductor, nombre, telefono),
      cliente: id_cliente (id_cliente, nombre)
    `
    )
    .single();

  if (error) throw new Error(error.message);
  return transformServicio(data);
};

/**
 * Actualiza un servicio existente
 */
export const updateServicio = async (
  id: number,
  servicio: Partial<ServicioFormData>
): Promise<Servicio> => {
  const { data, error } = await supabase
    .from("servicio")
    .update(servicio)
    .eq("id_servicio", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Elimina un servicio
 */
export const deleteServicio = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("servicio")
    .delete()
    .eq("id_servicio", id);

  if (error) throw new Error(error.message);
};
