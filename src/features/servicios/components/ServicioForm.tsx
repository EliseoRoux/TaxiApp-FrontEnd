import { useForm } from "react-hook-form";
import type { ServicioFormData, Servicio, Conductor } from "../types/servicio"; // Añadir Conductor al import
import { useEffect, useState } from "react";
import { useConductores } from "../hooks/useConductores";

type Props = {
  initialData?: Partial<Servicio>;
  onSubmit: (data: ServicioFormData) => Promise<void>;
  onCancel?: () => void;
};

export const ServicioForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const { conductores, loading: loadingConductores } = useConductores();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ServicioFormData>({
    defaultValues: {
      ...initialData,
      fecha: initialData?.fecha || new Date().toISOString().split("T")[0],
      hora:
        initialData?.hora ||
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      eurotaxi: initialData?.eurotaxi || false,
      mascota: initialData?.mascota || false,
      silla: initialData?.silla || false,
      viajeLargo: initialData?.viajeLargo || false,
      precio: initialData?.precio || 0,
      precio10: initialData?.precio
        ? Number((initialData.precio * 0.1).toFixed(2))
        : undefined,
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

  // Función de filtrado conductores:
  const filteredConductores = (conductores || []).filter((conductor) => {
    // Verifica que conductor y sus propiedades existan
    if (!conductor) return false;

    const nombre = conductor.nombre || "";
    const telefono = conductor.telefono || "";

    return (
      nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telefono.includes(searchTerm)
    );
  });

  // Función selectConductor:
  const selectConductor = (conductor: Conductor | null) => {
    setValue("conductor", conductor);
    if (conductor) {
      const nombre = conductor.nombre || "";
      const telefono = conductor.telefono || "";
      setSearchTerm(`${nombre} (${telefono})`);
    } else {
      setSearchTerm("");
    }
    setShowDropdown(false);
  };

  // Inicializar campo de búsqueda con conductor existente
  useEffect(() => {
    if (initialData?.conductor) {
      const nombre = initialData.conductor.nombre || "";
      const telefono = initialData.conductor.telefono || "";
      setSearchTerm(`${nombre} (${telefono})`);
    }
  }, [initialData]);

  const submitHandler = async (data: ServicioFormData) => {
    try {
      // Prepara los datos para enviar
      const servicioData = {
        ...data,
        n_persona: data.nPersona,
        precio_10:
          data.precio10 ||
          (data.precio ? Number((data.precio * 0.1).toFixed(2)) : 0),
        id_conductor: data.conductor?.idConductor || null,
        id_cliente: data.cliente?.idCliente || null,
      };

      await onSubmit(servicioData);
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

      {/* Campos de Servicio */}
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

      {/* Campo Conductor con búsqueda */}
      <div className="relative">
        <label className="block text-sm font-medium">
          Conductor (opcional)
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
            if (e.target.value === "") {
              selectConductor(null);
            }
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Buscar conductor por nombre o teléfono..."
          className="mt-1 p-2 w-full border rounded"
        />

        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {loadingConductores ? (
              <div className="p-2 text-gray-500">Cargando conductores...</div>
            ) : filteredConductores.length === 0 ? (
              <div className="p-2 text-gray-500">
                No se encontraron conductores
              </div>
            ) : (
              <>
                {filteredConductores.map((conductor) => (
                  <div
                    key={conductor.idConductor}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectConductor(conductor)}
                  >
                    {conductor.nombre} - {conductor.telefono}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Resto de campos */}
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
        <label className="block text-sm font-medium">
          Número de Personas:{" "}
        </label>
        <input
          type="number"
          {...register("nPersona", {
            required: "Campo obligatorio",
            valueAsNumber: true,
          })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.nPersona && (
          <span className="text-red-500 text-sm">
            {errors.nPersona.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Requisitos: </label>
        <input
          {...register("requisitos")}
          className="mt-1 p-2 w-full border rounded"
        />
      </div>

      {/* Botones */}
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
          {initialData?.id_servicio ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
};
