import { useState } from "react";
import { ConductorList } from "../components/ConductorList";
import { ConductorForm } from "../components/ConductorForm";
import { useConductores } from "../hooks/useConductores";
import type { ConductorResponse, ConductorFormData } from "../types/conductor";

const ListaConductores = () => {
  const {
    conductores,
    isLoading,
    addConductor,
    editConductor,
    removeConductor,
    payDebt,
  } = useConductores();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingConductor, setEditingConductor] =
    useState<ConductorResponse | null>(null);

  const handleEdit = (conductor: ConductorResponse) => {
    setEditingConductor(conductor);
    setIsFormVisible(true);
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este conductor?")
    ) {
      removeConductor(id);
    }
  };

  // --- CORRECCIÓN AQUÍ ---
  const handlePay = (conductor: ConductorResponse) => {
    if (
      window.confirm(
        `¿Confirmas que la deuda de ${conductor.nombre} (€${conductor.deuda}) ha sido saldada?`
      )
    ) {
      // Le pasamos solo el ID del conductor a la función payDebt,
      // que es lo que espera ahora.
      payDebt(conductor.idConductor);
    }
  };

  const handleFormSubmit = async (data: ConductorFormData) => {
    if (editingConductor) {
      editConductor({ id: editingConductor.idConductor, data });
    } else {
      addConductor(data);
    }
    setIsFormVisible(false);
    setEditingConductor(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingConductor(null);
  };

  const handleAddNew = () => {
    setEditingConductor(null);
    setIsFormVisible(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Conductores</h1>

      {!isFormVisible && (
        <button
          onClick={handleAddNew}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Añadir Nuevo Conductor
        </button>
      )}

      {isFormVisible && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            {editingConductor ? "Editar Conductor" : "Nuevo Conductor"}
          </h2>
          <ConductorForm
            onSubmit={handleFormSubmit}
            initialData={editingConductor || {}}
            onCancel={handleCancel}
          />
        </div>
      )}

      <ConductorList
        conductores={conductores}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPay={handlePay}
      />
    </div>
  );
};

export default ListaConductores;
