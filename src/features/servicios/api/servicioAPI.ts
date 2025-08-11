import { supabase } from "../../../lib/supabaseClient";
import type { Servicio, ServicioFormData, Conductor } from "../types/servicio";



// Función para transformar los datos de Supabase
const transformServicio = (data: {
  id_servicio: number;
  origen: string;
  destino: string;
  precio: number;
  fecha: string;
  eurotaxi: boolean;
  hora: string;
  n_persona: number;
  precio_10: number;
  requisitos: string;
  conductor: { id_conductor: number; nombre: string; telefono: string }[] | null;
  cliente: { id_cliente: number; nombre: string; telefono: string }[] | null;
}): Servicio => {
  return {
    id_servicio: data.id_servicio,
    origen: data.origen,
    destino: data.destino,
    precio: data.precio,
    fecha: data.fecha,
    eurotaxi: data.eurotaxi,
    hora: data.hora,
    nPersona: data.n_persona,
    precio10: data.precio_10,
    requisitos: data.requisitos,
    conductor: data.conductor?.[0] ? {  // Accedemos al primer elemento del array
      idConductor: data.conductor[0].id_conductor,
      nombre: data.conductor[0].nombre,
      telefono: data.conductor[0].telefono
    } : null,
    cliente: data.cliente?.[0] ? {  // Accedemos al primer elemento del array
      idCliente: data.cliente[0].id_cliente,
      nombre: data.cliente[0].nombre,
      telefono: data.cliente[0].telefono
    } : null
  };
};

export const fetchServicios = async (): Promise<Servicio[]> => {
  const { data, error } = await supabase
    .from("servicio")
    .select(`
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
      id_conductor,
      id_cliente,
      conductor:conductor(id_conductor, nombre, telefono),
      cliente:cliente(id_cliente, nombre, telefono)
    `)
    .order("fecha", { ascending: true });

  if (error) throw new Error(error.message);

  if (!data) return [];

  return data.map(transformServicio);
};

export const createServicio = async (
  servicio: ServicioFormData
): Promise<Servicio> => {
  // Primero creamos el cliente si no existe
  let clienteId = servicio.cliente?.idCliente;
  
  if (!clienteId && servicio.cliente?.nombre && servicio.cliente.telefono) {
    const { data: newCliente, error: clienteError } = await supabase
      .from("cliente")
      .insert({
        nombre: servicio.cliente.nombre,
        telefono: servicio.cliente.telefono
      })
      .select("id_cliente")
      .single();
    
    if (clienteError) throw new Error(clienteError.message);
    clienteId = newCliente.id_cliente;
  }

  // Creamos el servicio
  const { data, error } = await supabase
    .from("servicio")
    .insert({
      origen: servicio.origen,
      destino: servicio.destino,
      precio: servicio.precio,
      fecha: servicio.fecha,
      eurotaxi: servicio.eurotaxi,
      hora: servicio.hora,
      n_persona: servicio.nPersona,
      precio_10: servicio.precio10,
      requisitos: servicio.requisitos,
      id_conductor: servicio.conductor?.idConductor,
      id_cliente: clienteId
    })
    .select(`
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
      conductor:conductor(id_conductor, nombre, telefono),
      cliente:cliente(id_cliente, nombre, telefono)
    `)
    .single();

  if (error) throw new Error(error.message);
  
  return transformServicio(data);
};

export const updateServicio = async (
  id: number,
  servicio: Partial<ServicioFormData>
): Promise<Servicio> => {
  // Preparamos los datos para actualizar
  const updateData = {
    origen: servicio.origen,
    destino: servicio.destino,
    precio: servicio.precio,
    fecha: servicio.fecha,
    eurotaxi: servicio.eurotaxi,
    hora: servicio.hora,
    n_persona: servicio.nPersona,
    precio_10: servicio.precio10,
    requisitos: servicio.requisitos,
    id_conductor: servicio.conductor?.idConductor,
    id_cliente: servicio.cliente?.idCliente
  };

  const { data, error } = await supabase
    .from("servicio")
    .update(updateData)
    .eq("id_servicio", id)
    .select(`
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
      conductor:conductor(id_conductor, nombre, telefono),
      cliente:cliente(id_cliente, nombre, telefono)
    `)
    .single();

  if (error) throw new Error(error.message);
  
  return transformServicio(data);
};

export const deleteServicio = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("servicio")
    .delete()
    .eq("id_servicio", id);

  if (error) throw new Error(error.message);
};

export const fetchConductores = async (): Promise<Conductor[]> => {
  const { data, error } = await supabase
    .from("conductor")
    .select("id_conductor, nombre, telefono")
    .order("nombre", { ascending: true });

  if (error) throw new Error(error.message);
  return data ? data.map(c => ({
    idConductor: c.id_conductor,
    nombre: c.nombre,
    telefono: c.telefono
  })) : [];
};