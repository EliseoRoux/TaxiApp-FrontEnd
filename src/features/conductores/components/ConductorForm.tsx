import { useForm } from "react-hook-form";
import type { Conductor, ConductorFormData } from "../types/conductor";

type Props = {
  initialData?: Partial<Conductor>;
  onSubmit: (data: ConductorFormData) => Promise<void>;
  onCancel?: () => void;
};

export const ConductorForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ConductorFormData>({
    defaultValues: {
      nombre: initialData?.nombre || "",
      telefono: initialData?.telefono || "",
      deuda: initialData?.deuda || 0,
      dineroGenerado: initialData?.dineroGenerado || 0
    }
  });

  const submitHandler = async (data: ConductorFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 p-4 border rounded-lg bg-white">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre:</label>
        <input
          {...register("nombre", { 
            required: "Nombre es obligatorio",
            minLength: { value: 2, message: "Mínimo 2 caracteres" }
          })}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.nombre && (
          <span className="text-red-500 text-sm">{errors.nombre.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono:</label>
        <input
          {...register("telefono", { 
            required: "Teléfono es obligatorio",
            pattern: {
              value: /^(\+?[0-9]{1,3}[-.\s]?)?([0-9]{2,4}[-.\s]?){2,4}[0-9]{2,4}$/,
              message: "Teléfono inválido"
            }
          })}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.telefono && (
          <span className="text-red-500 text-sm">{errors.telefono.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Deuda:</label>
        <input
          type="number"
          step="0.01"
          {...register("deuda", { 
            valueAsNumber: true,
            min: { value: 0, message: "La deuda no puede ser negativa" }
          })}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.deuda && (
          <span className="text-red-500 text-sm">{errors.deuda.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dinero Generado:</label>
        <input
          type="number"
          step="0.01"
          {...register("dineroGenerado", { 
            valueAsNumber: true,
            min: { value: 0, message: "El dinero generado no puede ser negativo" }
          })}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.dineroGenerado && (
          <span className="text-red-500 text-sm">{errors.dineroGenerado.message}</span>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {initialData?.idConductor ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
};