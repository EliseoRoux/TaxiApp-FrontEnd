import type { Conductor, ConductorFormData, ConductorResponse } from "../types/conductor";

const API_BASE_URL = 'http://localhost:8080/api/conductor';

export const fetchConductores = async (): Promise<ConductorResponse[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error('Error al obtener conductores');
  return response.json();
};

export const createConductor = async (conductor: ConductorFormData): Promise<Conductor> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(conductor),
  });
  
  if (!response.ok) throw new Error('Error al crear conductor');
  return response.json();
};

export const updateConductor = async (id: number, conductor: ConductorFormData): Promise<Conductor> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(conductor),
  });
  
  if (!response.ok) throw new Error('Error al actualizar conductor');
  return response.json();
};

export const deleteConductor = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) throw new Error('Error al eliminar conductor');
};