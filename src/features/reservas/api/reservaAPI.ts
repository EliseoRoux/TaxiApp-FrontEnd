import { supabase } from "../../../lib/supabaseClient";
import type { Reserva, ReservaFormData, Conductor, Cliente } from "../types/reserva";

interface ReservaAPIResponse {
  id_reserva?: number;
  idReserva?: number;
  origen: string;
  destino: string;
  n_persona?: number;
  nPersona?: number;
  fecha_reserva?: string;
  fechaReserva?: string;
  hora: string;
  eurotaxi: boolean;
  requisitos: string;
  precio: number;
  precio_10?: number;
  precio10?: number;
  conductor?: ConductorAPI | ConductorAPI[] | null; // Cambiado para aceptar array u objeto
  cliente?: ClienteAPI | ClienteAPI[] | null; // Cambiado para aceptar array u objeto
}

interface ConductorAPI {
  id_conductor?: number;
  idConductor?: number;
  nombre: string;
  telefono: string;
  deuda?: number;
  dinero_generado?: number;
}

interface ClienteAPI {
  id_cliente?: number;
  idCliente?: number;
  nombre: string;
  telefono: string;
}

const transformReserva = (data: ReservaAPIResponse): Reserva => {
  const mapConductor = (c: ConductorAPI): Conductor => ({
    idConductor: c.id_conductor ?? c.idConductor ?? 0,
    nombre: c.nombre,
    telefono: c.telefono,
    deuda: c.deuda ?? null,
    dineroGenerado: c.dinero_generado ?? null,
  });

  const mapCliente = (c: ClienteAPI): Cliente => ({
    idCliente: c.id_cliente ?? c.idCliente,
    nombre: c.nombre,
    telefono: c.telefono,
  });

  // Manejar conductor (puede ser array u objeto)
  const conductor = Array.isArray(data.conductor)
    ? data.conductor[0]
      ? mapConductor(data.conductor[0])
      : null
    : data.conductor
    ? mapConductor(data.conductor)
    : null;

  // Manejar cliente (puede ser array u objeto)
  const cliente = Array.isArray(data.cliente)
    ? data.cliente[0]
      ? mapCliente(data.cliente[0])
      : null
    : data.cliente
    ? mapCliente(data.cliente)
    : null;

  return {
    idReserva: data.id_reserva ?? data.idReserva ?? 0,
    origen: data.origen,
    destino: data.destino,
    nPersona: data.n_persona ?? data.nPersona ?? 0,
    fechaReserva: data.fecha_reserva ?? data.fechaReserva ?? '',
    hora: data.hora,
    eurotaxi: data.eurotaxi,
    requisitos: data.requisitos,
    precio: data.precio,
    precio10: data.precio_10 ?? data.precio10 ?? 0,
    conductor,
    cliente,
  };
};

// Resto del código se mantiene igual...
export const fetchReservas = async (): Promise<Reserva[]> => {
  const { data, error } = await supabase
    .from("reserva")
    .select(`
      id_reserva,
      origen,
      destino,
      n_persona,
      fecha_reserva,
      hora,
      eurotaxi,
      requisitos,
      precio,
      precio_10,
      conductor:conductor(id_conductor, nombre, telefono, deuda, dinero_generado),
      cliente:cliente(id_cliente, nombre, telefono)
    `)
    .order("fecha_reserva", { ascending: true });

  if (error) throw new Error(error.message);
  return data ? data.map(transformReserva) : [];
};

export const createReserva = async (reserva: ReservaFormData): Promise<Reserva> => {
  let clienteId = reserva.cliente?.idCliente;

  // Validación de cliente
  if (reserva.cliente && (!reserva.cliente.nombre || !reserva.cliente.telefono)) {
    throw new Error("Nombre y teléfono del cliente son obligatorios");
  }

  // Búsqueda de cliente existente
  if (!clienteId && reserva.cliente?.telefono) {
    const { data: existingCliente } = await supabase
      .from("cliente")
      .select("id_cliente")
      .ilike("telefono", reserva.cliente.telefono.trim())
      .maybeSingle();

    if (existingCliente) {
      clienteId = existingCliente.id_cliente;
    } else if (reserva.cliente?.nombre) {
      const { data: newCliente } = await supabase
        .from("cliente")
        .insert({
          nombre: reserva.cliente.nombre.trim(),
          telefono: reserva.cliente.telefono.trim(),
        })
        .select("id_cliente")
        .single();
      clienteId = newCliente!.id_cliente;
    }
  }

  const { data, error } = await supabase
    .from("reserva")
    .insert({
      origen: reserva.origen,
      destino: reserva.destino,
      n_persona: reserva.nPersona,
      fecha_reserva: reserva.fechaReserva,
      hora: reserva.hora,
      eurotaxi: reserva.eurotaxi,
      requisitos: reserva.requisitos,
      precio: reserva.precio,
      precio_10: reserva.precio10,
      id_conductor: reserva.conductor?.idConductor,
      id_cliente: clienteId,
    })
    .select(`
      id_reserva,
      origen,
      destino,
      n_persona,
      fecha_reserva,
      hora,
      eurotaxi,
      requisitos,
      precio,
      precio_10,
      conductor:conductor(id_conductor, nombre, telefono, deuda, dinero_generado),
      cliente:cliente(id_cliente, nombre, telefono)
    `)
    .single();

  if (error) throw new Error(error.message);
  return transformReserva(data);
};

export const updateReserva = async (id: number, reserva: Partial<ReservaFormData>): Promise<Reserva> => {
  let clienteId = reserva.cliente?.idCliente;

  if (!clienteId && reserva.cliente?.telefono) {
    const { data: existingCliente } = await supabase
      .from("cliente")
      .select("id_cliente")
      .ilike("telefono", reserva.cliente.telefono.trim())
      .maybeSingle();
    clienteId = existingCliente?.id_cliente;
  }

  const updateData = {
    origen: reserva.origen,
    destino: reserva.destino,
    n_persona: reserva.nPersona,
    fecha_reserva: reserva.fechaReserva,
    hora: reserva.hora,
    eurotaxi: reserva.eurotaxi,
    requisitos: reserva.requisitos,
    precio: reserva.precio,
    precio_10: reserva.precio10,
    id_conductor: reserva.conductor?.idConductor,
    id_cliente: clienteId,
  };

  const { data, error } = await supabase
    .from("reserva")
    .update(updateData)
    .eq("id_reserva", id)
    .select(`
      id_reserva,
      origen,
      destino,
      n_persona,
      fecha_reserva,
      hora,
      eurotaxi,
      requisitos,
      precio,
      precio_10,
      conductor:conductor(id_conductor, nombre, telefono, deuda, dinero_generado),
      cliente:cliente(id_cliente, nombre, telefono)
    `)
    .single();

  if (error) throw new Error(error.message);
  return transformReserva(data);
};

export const deleteReserva = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("reserva")
    .delete()
    .eq("id_reserva", id);

  if (error) throw new Error(error.message);
};