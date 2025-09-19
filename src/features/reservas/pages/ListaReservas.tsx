// src/features/reservas/pages/ListaReservas.tsx

import { useState } from "react";
import { useReservas } from "../hooks/useReservas";
import { ReservaForm } from "../components/ReservaForm";
import { ReservaList } from "../components/ReservaList";
import type { Reserva, ReservaFormData } from "../types/reserva";

const ListaReservas = () => {
  const {
    reservas,
    clientes,
    conductores,
    isLoading,
    addReserva,
    editReserva,
    removeReserva,
  } = useReservas();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null);

  const handleEdit = (reserva: Reserva) => {
    setEditingReserva(reserva);
    setIsFormVisible(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Seguro que quieres eliminar esta reserva?")) {
      removeReserva(id);
    }
  };

  const handleFormSubmit = (data: ReservaFormData) => {
    if (editingReserva) {
      editReserva({ id: editingReserva.idReserva, data });
    } else {
      addReserva(data);
    }
    setIsFormVisible(false);
    setEditingReserva(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingReserva(null);
  };

  const handleAddNew = () => {
    setEditingReserva(null);
    setIsFormVisible(true);
  };

  if (isLoading) return <p className="p-4">Cargando datos...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>
      {!isFormVisible && (
        <button
          onClick={handleAddNew}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Añadir Nueva Reserva
        </button>
      )}
      {isFormVisible && (
        <ReservaForm
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          clientes={clientes}
          conductores={conductores}
          initialData={
            editingReserva
              ? {
                  origen: editingReserva.origen,
                  destino: editingReserva.destino,
                  nPersona: editingReserva.nPersona,
                  fechaReserva: editingReserva.fechaReserva.substring(0, 10),
                  hora: editingReserva.hora,
                  eurotaxi: editingReserva.eurotaxi,
                  requisitos: editingReserva.requisitos,
                  precio: editingReserva.precio,
                  precio10: editingReserva.precio10,
                  mascota: editingReserva.mascota,
                  silla: editingReserva.silla,
                  viajeLargo: editingReserva.viajeLargo,
                  clienteId: editingReserva.cliente?.idCliente || 0,
                  conductorId: editingReserva.conductor?.idConductor || null,
                }
              : {}
          }
        />
      )}
      {!isFormVisible && (
        <ReservaList
          reservas={reservas}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ListaReservas;
