import { supabase } from "../../../lib/supabaseClient";
import type {
  Cliente,
  ClienteFormData,
  ClienteResponse,
} from "../types/cliente";

export const fetchClientes = async (): Promise<ClienteResponse[]> => {
  try {
    console.log("🔍 Buscando clientes en Supabase...");

    // PRIMERO: Obtener los datos de clientes
    const { data: clientesData, error: clientesError } = await supabase
      .from("cliente")
      .select(
        "id_cliente, nombre, telefono, fecha_creacion, fecha_actualizacion"
      )
      .order("nombre", { ascending: true });

    if (clientesError) {
      console.error("❌ Error de Supabase:", clientesError);
      throw new Error(clientesError.message);
    }

    console.log("📦 Datos crudos de Supabase:", clientesData);

    if (!clientesData || clientesData.length === 0) {
      console.log("ℹ️ No se encontraron clientes en la base de datos");
      return [];
    }

    // SEGUNDO: Obtener el count de servicios para cada cliente
    const clientesConCount = await Promise.all(
      clientesData.map(async (cliente) => {
        try {
          const { count, error: countError } = await supabase
            .from("servicio")
            .select("*", { count: "exact", head: true })
            .eq("id_cliente", cliente.id_cliente);

          if (countError) {
            console.error(
              `Error contando servicios para cliente ${cliente.id_cliente}:`,
              countError
            );
            return { ...cliente, count: 0 };
          }

          return { ...cliente, count: count || 0 };
        } catch (error) {
          console.error(
            `Error en count para cliente ${cliente.id_cliente}:`,
            error
          );
          return { ...cliente, count: 0 };
        }
      })
    );

    const resultado = clientesConCount.map((cliente) => ({
      idCliente: cliente.id_cliente,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      fechaCreacion: cliente.fecha_creacion,
      fechaActualizacion: cliente.fecha_actualizacion ?? null,
      totalServicios: cliente.count,
    }));

    console.log("✅ Clientes transformados:", resultado);
    return resultado;
  } catch (error) {
    console.error("💥 Error fatal en fetchClientes:", error);
    throw error;
  }
};

// ... el resto de las funciones permanecen igual
export const createCliente = async (
  cliente: ClienteFormData
): Promise<Cliente> => {
  console.log("➕ Creando cliente:", cliente);

  const { data, error } = await supabase
    .from("cliente")
    .insert({
      nombre: cliente.nombre.trim(),
      telefono: cliente.telefono.trim(),
    })
    .select("id_cliente, nombre, telefono")
    .single();

  if (error) {
    console.error("❌ Error creando cliente:", error);
    throw new Error(error.message);
  }

  console.log("✅ Cliente creado:", data);
  return {
    idCliente: data.id_cliente,
    nombre: data.nombre,
    telefono: data.telefono,
  };
};

export const updateCliente = async (
  id: number,
  cliente: ClienteFormData
): Promise<Cliente> => {
  const { data, error } = await supabase
    .from("cliente")
    .update({
      nombre: cliente.nombre.trim(),
      telefono: cliente.telefono.trim(),
    })
    .eq("id_cliente", id)
    .select("id_cliente, nombre, telefono")
    .single();

  if (error) throw new Error(error.message);
  return {
    idCliente: data.id_cliente,
    nombre: data.nombre,
    telefono: data.telefono,
  };
};

export const deleteCliente = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("cliente")
    .delete()
    .eq("id_cliente", id);

  if (error) throw new Error(error.message);
};

export const searchClientes = async (query: string): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from("cliente")
    .select("id_cliente, nombre, telefono")
    .or(`nombre.ilike.%${query}%,telefono.ilike.%${query}%`)
    .limit(10);

  if (error) throw new Error(error.message);
  return (
    data?.map((cliente) => ({
      idCliente: cliente.id_cliente,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
    })) || []
  );
};
