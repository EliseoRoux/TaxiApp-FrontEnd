import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  fetchConductores,
  createConductor,
  updateConductor,
  deleteConductor,
  payConductorDebt, // Importamos la nueva función que hemos creado.
} from "../api/conductorAPI";
// Corregimos el import: ya no necesitamos 'ConductorResponse' aquí.
import type { ConductorFormData } from "../types/conductor";

export const useConductores = () => {
  const queryClient = useQueryClient();

  // OBTENER DATOS (sin cambios)
  const {
    data: conductores,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["conductores"],
    queryFn: fetchConductores,
  });

  // CREAR (sin cambios)
  const { mutate: addConductor, isPending: isCreating } = useMutation({
    mutationFn: (conductorData: ConductorFormData) =>
      createConductor(conductorData),
    onSuccess: () => {
      toast.success("Conductor creado con éxito");
      queryClient.invalidateQueries({ queryKey: ["conductores"] });
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el conductor: ${error.message}`);
    },
  });

  // ACTUALIZAR (sin cambios)
  const { mutate: editConductor, isPending: isUpdating } = useMutation({
    mutationFn: (variables: { id: number; data: ConductorFormData }) =>
      updateConductor(variables.id, variables.data),
    onSuccess: () => {
      toast.success("Conductor actualizado con éxito");
      queryClient.invalidateQueries({ queryKey: ["conductores"] });
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el conductor: ${error.message}`);
    },
  });

  // ELIMINAR (sin cambios)
  const { mutate: removeConductor, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteConductor(id),
    onSuccess: () => {
      toast.success("Conductor eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["conductores"] });
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el conductor: ${error.message}`);
    },
  });

  // PAGAR DEUDA (sin cambios en la lógica, ya estaba corregido)
  const { mutate: payDebt, isPending: isPaying } = useMutation({
    mutationFn: (conductorId: number) => payConductorDebt(conductorId),
    onSuccess: () => {
      toast.success("Deuda saldada con éxito");
      queryClient.invalidateQueries({ queryKey: ["conductores"] });
    },
    onError: (error: Error) => {
      toast.error(`Error al saldar la deuda: ${error.message}`);
    },
  });

  return {
    conductores: conductores || [],
    isLoading,
    isError,
    addConductor,
    isCreating,
    editConductor,
    isUpdating,
    removeConductor,
    isDeleting,
    payDebt,
    isPaying,
  };
};
