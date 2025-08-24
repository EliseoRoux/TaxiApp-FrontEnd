import { useState, useEffect } from 'react';
import { 
  fetchConductores, 
  createConductor, 
  updateConductor, 
  deleteConductor ,
  pagarDeuda
} from '../api/conductorAPI';
import type { ConductorFormData, ConductorResponse } from '../types/conductor';

export const useConductores = () => {
  const [conductores, setConductores] = useState<ConductorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConductores();
  }, []);

   const payDeuda = async (id: number) => {
    await pagarDeuda(id);
    await loadConductores();
  };

  const loadConductores = async () => {
    try {
      setLoading(true);
      const data = await fetchConductores();
      setConductores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const addConductor = async (conductor: ConductorFormData) => {
    const newConductor = await createConductor(conductor);
    await loadConductores();
    return newConductor;
  };

  const editConductor = async (id: number, conductor: ConductorFormData) => {
    const updated = await updateConductor(id, conductor);
    await loadConductores();
    return updated;
  };

  const removeConductor = async (id: number) => {
    await deleteConductor(id);
    await loadConductores();
  };

  return {
    conductores,
    loading,
    error,
    addConductor,
    editConductor,
    removeConductor,
    payDeuda,
    refresh: loadConductores
  };
};