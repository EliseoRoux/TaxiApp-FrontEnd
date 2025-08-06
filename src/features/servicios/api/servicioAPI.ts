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
  // Transformamos conductor y clientes anidados
  conductor: servicioDB.conductor?.[0]
    ?{ 
      idConductor: servicioDB.conductor?.[0].id_conductor,
      nombre: servicioDB.conductor?.[0].nombre,
      telefono: servicioDB.conductor?.[0].telefono
  } : undefined,
  cliente: servicioDB.cliente?.[0]
  ?{
    idCliente: servicioDB.cliente?.[0].id_cliente,
    nombre: servicioDB.cliente?.[0].nombre,
    telefono: servicioDB.cliente?.[0].telefono
  } : undefined,
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
      cliente: id_cliente (id_cliente, nombre, telefono)
    `
    )
    .order("fecha", { ascending: false });

  if (error) throw new Error(error.message);
  return data ? data.map(transformServicio) : [];
};

// Las demás funciones (create, update, delete) se mantienen igual

/**
 * Crea un nuevo servicio
 */
export const createServicio = async (
  servicio: ServicioFormData
): Promise<Servicio> => {
  const response = await fetch('http://localhost:8080/servicios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(servicio)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear servicio: ${errorText}`);
  }

  const data = await response.json();
  return transformServicio(data); // o adaptar a transformServicio(data) si usas una transformación
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
