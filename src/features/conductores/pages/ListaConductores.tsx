import { useState, useMemo } from "react"; 
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
  // --- Estado para el filtro de búsqueda por teléfono ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- LÓGICA DE FILTRADO ---
  const filteredConductores = useMemo(() => {
    if (!searchTerm) {
      return conductores; // Si no hay búsqueda, muestra todos
    }
    return conductores.filter((conductor) =>
      conductor.telefono.includes(searchTerm)
    );
  }, [conductores, searchTerm]);

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

  const handlePay = (conductor: ConductorResponse) => {
    if (
      window.confirm(
        `¿Confirmas que la deuda de ${conductor.nombre} (€${conductor.deuda}) ha sido saldada?`
      )
    ) {
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Conductores</h1>
        {!isFormVisible && (
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Añadir Nuevo Conductor
          </button>
        )}
      </div>

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

      {/* --- Barra de búsqueda --- */}
      {!isFormVisible && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md"
          />
        </div>
      )}

      <ConductorList
        conductores={filteredConductores}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPay={handlePay}
      />
    </div>
  );
};

export default ListaConductores;
