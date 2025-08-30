import { useForm } from "react-hook-form";
import type { ReservaFormData, Reserva, Conductor } from "../types/reserva";
import { useEffect, useState } from "react";
import { useConductores } from "../hooks/useConductores";

type Props = {
  initialData?: Partial<Reserva>;
  onSubmit: (data: ReservaFormData) => Promise<void>;
  onCancel?: () => void;
};

export const ReservaForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const { conductores } = useConductores();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReservaFormData>({
    defaultValues: {
      ...initialData,
      fechaReserva:
        initialData?.fechaReserva || new Date().toISOString().split("T")[0],
      hora: initialData?.hora || "12:00",
      eurotaxi: initialData?.eurotaxi || false,
      mascota: initialData?.mascota || false,
      silla: initialData?.silla || false,
      viajeLargo: initialData?.viajeLargo || false,
      nPersona: initialData?.nPersona || 1,
      precio: initialData?.precio || 0,
      precio10: initialData?.precio10 || 0,
      conductor: initialData?.conductor || null,
    },
  });

  // Calculamos precio10 automáticamente
  const precio = watch("precio");
  useEffect(() => {
    if (precio && typeof precio === "number") {
      setValue("precio10", Number((precio * 0.1).toFixed(2)));
    } else {
      setValue("precio10", 0);
    }
  }, [precio, setValue]);

  const filteredConductores = conductores.filter((conductor: Conductor) => {
    const nombre = conductor.nombre || "";
    const telefono = conductor.telefono || "";
    return (
      nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telefono.includes(searchTerm)
    );
  });

  const selectConductor = (conductor: Conductor | null) => {
    setValue("conductor", conductor);
    if (conductor) {
      setSearchTerm(`${conductor.nombre} (${conductor.telefono})`);
    } else {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    if (initialData?.conductor) {
      const nombre = initialData.conductor.nombre || "";
      const telefono = initialData.conductor.telefono || "";
      setSearchTerm(`${nombre} (${telefono})`);
    }
  }, [initialData]);

  const submitHandler = async (data: ReservaFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4 p-4 border rounded-lg"
    >
      {/* Campos de Cliente */}
      <div>
        <label className="block text-sm font-medium">Nombre Cliente: </label>
        <input
          {...register("cliente.nombre", { required: "Campo obligatorio" })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.cliente?.nombre && (
          <span className="text-red-500 text-sm">
            {errors.cliente.nombre.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Teléfono Cliente: </label>
        <input
          {...register("cliente.telefono", { required: "Campo obligatorio" })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.cliente?.telefono && (
          <span className="text-red-500 text-sm">
            {errors.cliente.telefono.message}
          </span>
        )}
      </div>

      {/* Campos de Reserva */}
      <div>
        <label className="block text-sm font-medium">Origen: </label>
        <input
          {...register("origen", { required: "Campo obligatorio" })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.origen && (
          <span className="text-red-500 text-sm">{errors.origen.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Destino: </label>
        <input
          {...register("destino", { required: "Campo obligatorio" })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.destino && (
          <span className="text-red-500 text-sm">{errors.destino.message}</span>
        )}
      </div>

      {/* Fecha y Hora MANUALES */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Fecha: </label>
          <input
            type="date"
            {...register("fechaReserva", { required: "Campo obligatorio" })}
            className="mt-1 p-2 w-full border rounded"
          />
          {errors.fechaReserva && (
            <span className="text-red-500 text-sm">
              {errors.fechaReserva.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Hora: </label>
          <input
            type="time"
            {...register("hora", { required: "Campo obligatorio" })}
            className="mt-1 p-2 w-full border rounded"
          />
          {errors.hora && (
            <span className="text-red-500 text-sm">{errors.hora.message}</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Precio: </label>
        <input
          type="number"
          step="0.01"
          {...register("precio", {
            required: "Campo obligatorio",
            valueAsNumber: true,
          })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.precio && (
          <span className="text-red-500 text-sm">{errors.precio.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Precio 10%: </label>
        <input
          type="number"
          step="0.01"
          {...register("precio10")}
          readOnly
          className="mt-1 p-2 w-full border rounded bg-gray-100"
        />
      </div>

      {/* Campo Conductor */}
      <div className="relative">
        <label className="block text-sm font-medium">
          Conductor (opcional)
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value === "") {
              setValue("conductor", null);
            }
          }}
          placeholder="Buscar conductor por nombre o teléfono..."
          className="mt-1 p-2 w-full border rounded"
        />

        {searchTerm && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredConductores.length === 0 ? (
              <div className="p-2 text-gray-500">
                No se encontraron conductores
              </div>
            ) : (
              filteredConductores.map((conductor) => (
                <div
                  key={conductor.idConductor}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectConductor(conductor)}
                >
                  {conductor.nombre} - {conductor.telefono}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Número de Personas:{" "}
        </label>
        <input
          type="number"
          {...register("nPersona", {
            required: "Campo obligatorio",
            valueAsNumber: true,
            min: { value: 1, message: "Mínimo 1 persona" },
          })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.nPersona && (
          <span className="text-red-500 text-sm">
            {errors.nPersona.message}
          </span>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="eurotaxi"
          {...register("eurotaxi")}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="eurotaxi" className="ml-2 block text-sm font-medium">
          Eurotaxi
        </label>
      </div>

      {/* Mascota */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="mascota"
          {...register("mascota")}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="mascota" className="ml-2 block text-sm font-medium">
          Mascota
        </label>
      </div>

      {/* Silla */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="silla"
          {...register("silla")}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="silla" className="ml-2 block text-sm font-medium">
          Silla de bebé
        </label>
      </div>

      {/* Viaje Largo */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="viajeLargo"
          {...register("viajeLargo")}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="viajeLargo" className="ml-2 block text-sm font-medium">
          Viaje fuera de Madrid
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium">Requisitos: </label>
        <input
          {...register("requisitos")}
          className="mt-1 p-2 w-full border rounded"
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {initialData?.idReserva ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
};
