import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { ReservaFormData } from "../types/reserva";
import type { ConductorResponse } from "../../conductores/types/conductor";

type Props = {
  initialData?: Partial<ReservaFormData>;
  onSubmit: (data: ReservaFormData) => void;
  onCancel: () => void;
  conductores: ConductorResponse[];
};

export const ReservaForm = ({
  initialData,
  onSubmit,
  onCancel,
  conductores,
}: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservaFormData>({
    defaultValues: {
      ...initialData,
      nPersona: initialData?.nPersona || 1,
      precio: initialData?.precio || 0,
      precio10: initialData?.precio10 || 0,
      fechaReserva:
        initialData?.fechaReserva?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      hora: initialData?.hora || "12:00",
    },
  });

  const precioActual = watch("precio");

  useEffect(() => {
    const precioNumerico = Number(precioActual) || 0;
    const precioCon10 = precioNumerico * 0.1;
    setValue("precio10", Number(precioCon10.toFixed(2)));
  }, [precioActual, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 border rounded-lg bg-white"
    >
      {/* --- CAMPOS PRINCIPALES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Origen:</label>
          <input
            {...register("origen", { required: "El origen es obligatorio" })}
          />
          {errors.origen && (
            <span className="text-red-500 text-sm">
              {errors.origen.message}
            </span>
          )}
        </div>
        <div>
          <label>Destino:</label>
          <input
            {...register("destino", { required: "El destino es obligatorio" })}
          />
          {errors.destino && (
            <span className="text-red-500 text-sm">
              {errors.destino.message}
            </span>
          )}
        </div>
        <div>
          <label>Nombre del Cliente:</label>
          <input
            {...register("clienteNombre", {
              required: "El nombre es obligatorio",
            })}
          />
          {errors.clienteNombre && (
            <span className="text-red-500 text-sm">
              {errors.clienteNombre.message}
            </span>
          )}
        </div>
        <div>
          <label>Teléfono del Cliente:</label>
          <input
            {...register("clienteTelefono", {
              required: "El teléfono es obligatorio",
            })}
          />
          {errors.clienteTelefono && (
            <span className="text-red-500 text-sm">
              {errors.clienteTelefono.message}
            </span>
          )}
        </div>
        <div>
          <label>Conductor (Opcional):</label>
          <select
            {...register("idConductor", {
              setValueAs: (v) => (v ? Number(v) : null),
            })}
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

      {/* --- DETALLES --- */}
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
            readOnly
            className="mt-1 p-2 w-full border rounded-md bg-gray-100"
          />
        </div>
      </div>

      {/* --- REQUISITOS --- */}
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

      {/* --- BOTONES --- */}
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
