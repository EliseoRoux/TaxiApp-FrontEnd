import { useForm } from 'react-hook-form';
import type { ServicioFormData, Servicio } from '../types/servicio';
import { useEffect } from 'react';

type Props = {
  initialData?: Partial<Servicio>;
  onSubmit: (data: ServicioFormData) => Promise<void>;
  onCancel?: () => void;
};

export const ServicioForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch, 
    setValue 
  } = useForm<ServicioFormData>({
    defaultValues: {
      ...initialData,
      fecha: initialData?.fecha || new Date().toISOString().split('T')[0],
      hora: initialData?.hora || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eurotaxi: initialData?.eurotaxi || false,
      precio10: initialData?.precio ? Number((initialData.precio * 1.10).toFixed(2)) : undefined
    }
  });

  // Calculamos precio10 automáticamente cuando cambia el precio
  const precio = watch('precio');
  useEffect(() => {
    if (precio && typeof precio === 'number') {
      setValue('precio10', Number((precio * 1.10).toFixed(2)));
    } else {
      setValue('precio10', 0);
    }
  }, [precio, setValue]);

  const submitHandler = async (data: ServicioFormData) => {
    try {
      // Aseguramos que precio10 esté calculado
      if (data.precio && !data.precio10) {
        data.precio10 = Number((data.precio * 1.10).toFixed(2));
      }
      await onSubmit(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 p-4 border rounded-lg">
      {/* Campo Origen */}
      <div>
        <label className="block text-sm font-medium">Origen: </label>
        <input
          {...register('origen', { required: 'Campo obligatorio' })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.origen && <span className="text-red-500 text-sm">{errors.origen.message}</span>}
      </div>

      {/* Campo Destino */}
      <div>
        <label className="block text-sm font-medium">Destino: </label>
        <input
          {...register('destino', { required: 'Campo obligatorio' })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.destino && <span className="text-red-500 text-sm">{errors.destino.message}</span>}
      </div>

      {/* Campo Cliente */}
      <div>
        <label className="block text-sm font-medium">Cliente: </label>
        <input
          {...register('cliente.nombre', { required: 'Campo obligatorio' })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.cliente?.nombre && <span className="text-red-500 text-sm">{errors.cliente.nombre.message}</span>}
      </div>

      {/* Campo Precio */}
      <div>
        <label className="block text-sm font-medium">Precio: </label>
        <input
          type="number"
          step="0.01"
          {...register('precio', { 
            required: 'Campo obligatorio',
            valueAsNumber: true 
          })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.precio && <span className="text-red-500 text-sm">{errors.precio.message}</span>}
      </div>

      {/* Campo Precio +10% (automático) */}
      <div>
        <label className="block text-sm font-medium">Precio +10%: </label>
        <input
          type="number"
          step="0.01"
          {...register('precio10')}
          readOnly
          className="mt-1 p-2 w-full border rounded bg-gray-100"
        />
      </div>

      {/* Campo Eurotaxi (checkbox) */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="eurotaxi"
          {...register('eurotaxi')}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="eurotaxi" className="ml-2 block text-sm font-medium">
          Eurotaxi
        </label>
      </div>


      {/* Campo Número de personas */}
      <div>
        <label className="block text-sm font-medium">Número de Personas: </label>
        <input
          type="number"
          {...register('nPersona', { 
            required: 'Campo obligatorio',
            valueAsNumber: true 
          })}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.nPersona && <span className="text-red-500 text-sm">{errors.nPersona.message}</span>}
      </div>

      {/* Campo Requisitos */}
      <div>
        <label className="block text-sm font-medium">Requisitos: </label>
        <input
          {...register('requisitos')}
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
          {initialData?.id_servicio ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};