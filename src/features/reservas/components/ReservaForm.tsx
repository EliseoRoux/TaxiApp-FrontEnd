// src/features/reservas/components/ReservaForm.tsx

import { useForm } from "react-hook-form";
import type { ReservaFormData } from "../types/reserva";
import type { ClienteResponse } from "../../clientes/types/cliente";
import type { ConductorResponse } from "../../conductores/types/conductor";

// CORRECCIÓN: Se añaden las props que faltaban
type Props = {
  initialData?: Partial<ReservaFormData>;
  onSubmit: (data: ReservaFormData) => void;
  onCancel: () => void;
  clientes: ClienteResponse[];
  conductores: ConductorResponse[];
};

export const ReservaForm = ({
  initialData,
  onSubmit,
  onCancel,
  clientes,
  conductores,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservaFormData>({
    defaultValues: {
      ...initialData,
      fechaReserva:
        initialData?.fechaReserva || new Date().toISOString().split("T")[0],
      hora: initialData?.hora || "12:00",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 border rounded-lg bg-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Origen:
          </label>
          <input
            {...register("origen", { required: "El origen es obligatorio" })}
            className="mt-1 p-2 w-full border rounded-md"
          />
          {errors.origen && (
            <span className="text-red-500 text-sm">
              {errors.origen.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Destino:
          </label>
          <input
            {...register("destino", { required: "El destino es obligatorio" })}
            className="mt-1 p-2 w-full border rounded-md"
          />
          {errors.destino && (
            <span className="text-red-500 text-sm">
              {errors.destino.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cliente:
          </label>
          <select
            {...register("clienteId", {
              required: "Debe seleccionar un cliente",
              valueAsNumber: true,
            })}
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.idCliente} value={cliente.idCliente}>
                {cliente.nombre}
              </option>
            ))}
          </select>
          {errors.clienteId && (
            <span className="text-red-500 text-sm">
              {errors.clienteId.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Conductor (Opcional):
          </label>
          <select
            {...register("conductorId", {
              setValueAs: (v) => (v ? Number(v) : null),
            })}
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option value="">Sin asignar</option>
            {conductores.map((conductor) => (
              <option key={conductor.idConductor} value={conductor.idConductor}>
                {conductor.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ... (resto del formulario que ya tenías) ... */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium">Fecha:</label>
          <input
            type="date"
            {...register("fechaReserva", { required: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hora:</label>
          <input
            type="time"
            {...register("hora", { required: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Nº Personas:</label>
          <input
            type="number"
            {...register("nPersona", {
              required: true,
              valueAsNumber: true,
              min: 1,
            })}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Precio (€):</label>
          <input
            type="number"
            step="0.01"
            {...register("precio", { required: true, valueAsNumber: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Precio +10%:</label>
          <input
            type="number"
            step="0.01"
            {...register("precio10", { required: true, valueAsNumber: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Requisitos Especiales:
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input type="checkbox" {...register("mascota")} className="mr-2" />{" "}
            Mascota
          </label>
          <label className="flex items-center">
            <input type="checkbox" {...register("silla")} className="mr-2" />{" "}
            Silla de bebé
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("viajeLargo")}
              className="mr-2"
            />{" "}
            Viaje Largo
          </label>
          <label className="flex items-center">
            <input type="checkbox" {...register("eurotaxi")} className="mr-2" />{" "}
            Eurotaxi
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Observaciones/Requisitos:
        </label>
        <textarea
          {...register("requisitos")}
          className="mt-1 p-2 w-full border rounded-md"
          rows={3}
        ></textarea>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Guardar Reserva
        </button>
      </div>
    </form>
  );
};
