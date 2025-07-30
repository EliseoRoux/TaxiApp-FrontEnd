import React from 'react';

// Datos de ejemplo (luego los reemplazaremos con tu API real)
const serviciosEjemplo = [
  {
    idServicio: 1,
    origen: "Aeropuerto",
    destino: "Centro de la ciudad",
    precio: 25.50,
    fecha: "2025-08-01",
    conductor: "Juan Pérez"
  },
  {
    idServicio: 2,
    origen: "Estación Central",
    destino: "Zona Hotelera",
    precio: 18.00,
    fecha: "2025-08-02",
    conductor: "María García"
  }
];

export function ListaServicios() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Servicios de Taxi</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        {serviciosEjemplo.map((servicio) => (
          <div 
            key={servicio.idServicio}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold">{servicio.origen} → {servicio.destino}</h2>
            <p className="text-gray-600">Conductor: {servicio.conductor}</p>
            <p className="text-green-600 font-bold">${servicio.precio.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Fecha: {servicio.fecha}</p>
          </div>
        ))}
      </div>
    </div>
  );
}