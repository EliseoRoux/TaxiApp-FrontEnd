import { supabase } from "../../../lib/supabaseClient";
import type {
  Servicio,
  ServicioFormData,
  Conductor,
  Cliente,
} from "../types/servicio";

/* -------------------- Tipos intermedios para API -------------------- */
interface ConductorAPI {
  id_conductor?: number;
  idConductor?: number;
  nombre: string;
  telefono: string;
  deuda?: number;
  dinero_generado?: number;
  dineroGenerado?: number;
}

interface ClienteAPI {
  id_cliente?: number;
  idCliente?: number;
  nombre: string;
  telefono: string;
}

interface ServicioAPIResponse {
  id_servicio?: number;
  idServicio?: number;
  origen: string;
  destino: string;
  precio: number;
  fecha: string;
  eurotaxi: boolean;
  hora: string;
  n_persona?: number;
  nPersona?: number;
  precio_10?: number;
  precio10?: number;
  requisitos: string;
  conductor?: ConductorAPI | ConductorAPI[] | null;
  cliente?: ClienteAPI | ClienteAPI[] | null;
}

/* -------------------- Transformador -------------------- */
const transformServicio = (data: ServicioAPIResponse): Servicio => {
  const mapConductor = (c: ConductorAPI): Conductor => ({
    idConductor: c.id_conductor ?? c.idConductor ?? 0,
    nombre: c.nombre,
    telefono: c.telefono,
    deuda: c.deuda ?? null,
    dineroGenerado: c.dinero_generado ?? c.dineroGenerado ?? null,
  });

  const mapCliente = (c: ClienteAPI): Cliente => ({
    idCliente: c.id_cliente ?? c.idCliente,
    nombre: c.nombre,
    telefono: c.telefono,
  });

  return {
    id_servicio: data.id_servicio ?? data.idServicio ?? 0,
    origen: data.origen,
    destino: data.destino,
    precio: data.precio,
    fecha: data.fecha,
    eurotaxi: data.eurotaxi,
    hora: data.hora,
    nPersona: data.n_persona ?? data.nPersona ?? 0,
    precio10: data.precio_10 ?? data.precio10 ?? 0,
    requisitos: data.requisitos,

    conductor: Array.isArray(data.conductor)
      ? data.conductor[0]
        ? mapConductor(data.conductor[0])
        : null
      : data.conductor
      ? mapConductor(data.conductor)
      : null,

    cliente: Array.isArray(data.cliente)
      ? data.cliente[0]
        ? mapCliente(data.cliente[0])
        : null
      : data.cliente
      ? mapCliente(data.cliente)
      : null,
  };
};

/* -------------------- API Supabase -------------------- */
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
      id_conductor,
      id_cliente,
      conductor:conductor(id_conductor, nombre, telefono, deuda, dinero_generado),
      cliente:cliente(id_cliente, nombre, telefono)
    `
    )
    .order("fecha", { ascending: true });

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map(transformServicio);
};

export const createServicio = async (
  servicio: ServicioFormData
): Promise<Servicio> => {
  let clienteId = servicio.cliente?.idCliente;

  // MEJORA: Validación de datos del cliente
  if (
    servicio.cliente &&
    (!servicio.cliente.nombre || !servicio.cliente.telefono)
  ) {
    throw new Error("Nombre y teléfono del cliente son obligatorios");
  }

  // MEJORA: Búsqueda inteligente de cliente existente
  if (!clienteId && servicio.cliente?.telefono) {
    const telefono = servicio.cliente.telefono.trim();

    // Buscar cliente por teléfono (case insensitive)
    const { data: existingCliente, error: searchError } = await supabase
      .from("cliente")
      .select("id_cliente, nombre")
      .ilike("telefono", telefono) // ← Usar ilike para búsqueda case insensitive
      .maybeSingle();

    if (searchError) throw new Error(searchError.message);

    if (existingCliente) {
      // Cliente encontrado - usar ID existente
      clienteId = existingCliente.id_cliente;

      // OPCIONAL: Actualizar nombre si es diferente
      if (existingCliente.nombre !== servicio.cliente.nombre.trim()) {
        await supabase
          .from("cliente")
          .update({ nombre: servicio.cliente.nombre.trim() })
          .eq("id_cliente", clienteId);
      }
    } else if (servicio.cliente?.nombre) {
      // Cliente no existe - crear nuevo
      const { data: newCliente, error: clienteError } = await supabase
        .from("cliente")
        .insert({
          nombre: servicio.cliente.nombre.trim(),
          telefono: telefono,
        })
        .select("id_cliente")
        .single();

      if (clienteError) throw new Error(clienteError.message);
      clienteId = newCliente.id_cliente;
    }
  }

  // Validación de precio y cálculo automático de precio10
  const precio = servicio.precio || 0;
  const precio10 = servicio.precio10 || precio * 0.1;

  // Crear servicio con el cliente (existente o nuevo)
  const { data, error } = await supabase
    .from("servicio")
    .insert({
      origen: servicio.origen,
      destino: servicio.destino,
      precio: precio,
      fecha: servicio.fecha,
      eurotaxi: servicio.eurotaxi,
      hora: servicio.hora,
      n_persona: servicio.nPersona,
      precio_10: precio10, //  Usar el precio10 calculado
      requisitos: servicio.requisitos,
      id_conductor: servicio.conductor?.idConductor,
      id_cliente: clienteId,
    })
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
      conductor:conductor(id_conductor, nombre, telefono, deuda, dinero_generado),
      cliente:cliente(id_cliente, nombre, telefono)
    `
    )
    .single();

  if (error) throw new Error(error.message);
  return transformServicio(data);
};

export const updateServicio = async (
  id: number,
  servicio: Partial<ServicioFormData>
): Promise<Servicio> => {
  // Manejo de cliente para actualizaciones
  let clienteId = servicio.cliente?.idCliente;

  if (!clienteId && servicio.cliente?.telefono) {
    const telefono = servicio.cliente.telefono.trim();

    const { data: existingCliente, error: searchError } = await supabase
      .from("cliente")
      .select("id_cliente")
      .ilike("telefono", telefono)
      .maybeSingle();

    if (searchError) throw new Error(searchError.message);

    if (existingCliente) {
      clienteId = existingCliente.id_cliente;
    }
  }

  const updateData = {
    origen: servicio.origen,
    destino: servicio.destino,
    precio: servicio.precio,
    fecha: servicio.fecha,
    eurotaxi: servicio.eurotaxi,
    hora: servicio.hora,
    n_persona: servicio.nPersona,
    precio_10: servicio.precio10 || (servicio.precio || 0) * 0.1, //  Cálculo automático
    requisitos: servicio.requisitos,
    id_conductor: servicio.conductor?.idConductor,
    id_cliente: clienteId,
  };

  const { data, error } = await supabase
    .from("servicio")
    .update(updateData)
    .eq("id_servicio", id)
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
      conductor:conductor(id_conductor, nombre, telefono, deuda, dinero_generado),
      cliente:cliente(id_cliente, nombre, telefono)
    `
    )
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
    .select("id_conductor, nombre, telefono, deuda, dinero_generado")
    .order("nombre", { ascending: true });

  if (error) throw new Error(error.message);
  return data
    ? data.map((c) => ({
        idConductor: c.id_conductor,
        nombre: c.nombre,
        telefono: c.telefono,
        deuda: c.deuda ?? null,
        dineroGenerado: c.dinero_generado ?? null,
      }))
    : [];
};
