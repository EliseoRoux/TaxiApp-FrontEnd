import { useState, useEffect } from 'react';
import { fetchConductores } from '../api/servicioAPI';
import type { Conductor } from '../types/servicio';

export const useConductores = () => {
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    
    loadConductores();
  }, []);

  return { conductores, loading, error };
};