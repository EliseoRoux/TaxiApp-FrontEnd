import { useState, useEffect } from 'react';
import { 
  fetchServicios, 
  createServicio, 
  updateServicio, 
  deleteServicio 
} from '../api/servicioAPI';
import type { Servicio, ServicioFormData } from '../types/servicio';

export const useServicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar servicios al montar
  useEffect(() => {
    const loadServicios = async () => {
      try {
        setLoading(true);
        const data = await fetchServicios(); // Ya devuelve Servicio[]
        setServicios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    loadServicios();
  }, []);

  const addServicio = async (servicio: ServicioFormData) => {
    const newServicio = await createServicio(servicio); // Devuelve Servicio
    setServicios(prev => [newServicio, ...prev]);
  };

  const editServicio = async (id: number, servicio: Partial<ServicioFormData>) => {
    const updated = await updateServicio(id, servicio); // Devuelve Servicio
    setServicios(prev => prev.map(s => 
      s.id_servicio === id ? updated : s
    ));
  };

  const removeServicio = async (id: number) => {
    await deleteServicio(id);
    setServicios(prev => prev.filter(s => s.id_servicio !== id));
  };

  const refreshServicios = async () => {
    setLoading(true);
    try {
      const data = await fetchServicios(); // Devuelve Servicio[]
      setServicios(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al refrescar');
    } finally {
      setLoading(false);
    }
  };

  return {
    servicios,
    loading,
    error,
    addServicio,
    editServicio,
    removeServicio,
    refresh: refreshServicios
  };
};
