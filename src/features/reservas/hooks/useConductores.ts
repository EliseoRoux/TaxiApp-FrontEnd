import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import type { Conductor } from '../types/reserva';

export const useConductores = () => {
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConductores = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('conductor')
          .select('id_conductor, nombre, telefono, deuda, dinero_generado')
          .order('nombre', { ascending: true });

        if (error) throw error;

        setConductores(data ? data.map(c => ({
          idConductor: c.id_conductor,
          nombre: c.nombre,
          telefono: c.telefono,
          deuda: c.deuda ?? null,
          dineroGenerado: c.dinero_generado ?? null,
        })) : []);
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