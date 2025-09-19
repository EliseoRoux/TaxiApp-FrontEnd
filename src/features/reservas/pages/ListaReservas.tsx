
import { useState } from "react";
import { useReservas } from "../hooks/useReservas";
import { ReservaForm } from "../components/ReservaForm";
import { ReservaList } from "../components/ReservaList";
import type { Reserva, ReservaFormData } from "../types/reserva";

const ListaReservas = () => {
  const {
    reservas,
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

  // Preparamos los datos iniciales para el formulario de edición
  const initialDataForForm: Partial<ReservaFormData> = editingReserva
    ? {
        ...editingReserva,
        clienteNombre: editingReserva.cliente?.nombre || "",
        clienteTelefono: editingReserva.cliente?.telefono || "",
        idConductor: editingReserva.conductor?.idConductor || null,
        fechaReserva: editingReserva.fechaReserva.substring(0, 10), // Aseguramos formato YYYY-MM-DD
      }
    : {};

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
          conductores={conductores}
          initialData={initialDataForForm}
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
