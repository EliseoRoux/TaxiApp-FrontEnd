import { useState } from "react";
import { useConductores } from "../hooks/useConductores";
import { ConductorForm } from "../components/ConductorForm";
import { ConductorList } from "../components/ConductorList";
import type { ConductorResponse, ConductorFormData } from "../types/conductor";

export const ListaConductores = () => {
  const {
    conductores,
    loading,
    addConductor,
    editConductor,
    removeConductor,
    payDeuda,
  } = useConductores();
  const [editingConductor, setEditingConductor] =
    useState<ConductorResponse | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: ConductorFormData) => {
    try {
      if (editingConductor) {
        await editConductor(editingConductor.idConductor, data);
      } else {
        await addConductor(data);
      }
      setEditingConductor(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (conductor: ConductorResponse) => {
    setEditingConductor(conductor);
    setShowForm(true);
  };

  const handlePay = async (id: number) => {
    try {
      await payDeuda(id);
    } catch (error) {
      console.error("Error al pagar deuda:", error);
      alert("No se pudo marcar como pagada");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este conductor?")) {
      try {
        await removeConductor(id);
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se puede eliminar el conductor");
      }
    }
  };

  const handleCancel = () => {
    setEditingConductor(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestión de Conductores
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Nuevo Conductor
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <ConductorForm
            initialData={editingConductor || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      <ConductorList
        conductores={conductores}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPay={handlePay}
        loading={loading}
      />
    </div>
  );
};
