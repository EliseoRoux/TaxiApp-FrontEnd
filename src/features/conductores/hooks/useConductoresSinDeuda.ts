import { useEffect, useState } from "react";
import type { ConductorResponse } from "../types/conductor";
import { getConductoresSinDeuda } from "../api/conductorAPI";

export const useConductoresSinDeuda = () => {
  const [conductores, setConductores] = useState<ConductorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConductores = async () => {
    try {
      setLoading(true);
      const data = await getConductoresSinDeuda();
      setConductores(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConductores();
  }, []);

  return { conductores, loading, error, refresh: loadConductores };
};