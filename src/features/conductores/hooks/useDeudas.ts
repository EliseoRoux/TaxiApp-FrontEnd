import { useEffect, useState } from "react";
import type { ConductorResponse } from "../types/conductor";
import { getConductoresConDeuda } from "../api/conductorAPI";

export const useDeudas = () => {
  const [deudas, setDeudas] = useState<ConductorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeudas = async () => {
    try {
      setLoading(true);
      const data = await getConductoresConDeuda();
      setDeudas(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeudas();
  }, []);

  return { deudas, loading, error, refresh: loadDeudas };
};
