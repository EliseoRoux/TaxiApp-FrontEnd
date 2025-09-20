import { useState, useMemo } from "react";
import { ClienteList } from "../components/ClienteList";
import { ClienteForm } from "../components/ClienteForm";
import { useClientes } from "../hooks/useClientes";
import type { ClienteResponse, ClienteFormData } from "../types/cliente";

const ListaClientes = () => {
  const { clientes, isLoading, addCliente, editCliente, removeCliente } =
    useClientes();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCliente, setEditingCliente] = useState<ClienteResponse | null>(
    null
  );
  // --- Estado para el filtro de búsqueda por teléfono ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- LÓGICA DE FILTRADO ---
  const filteredClientes = useMemo(() => {
    if (!searchTerm) {
      return clientes; // Si no hay búsqueda, muestra todos
    }
    return clientes.filter((cliente) => cliente.telefono.includes(searchTerm));
  }, [clientes, searchTerm]);

  const handleEdit = (cliente: ClienteResponse) => {
    setEditingCliente(cliente);
    setIsFormVisible(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      removeCliente(id);
    }
  };

  const handleFormSubmit = async (data: ClienteFormData) => {
    if (editingCliente) {
      editCliente({ id: editingCliente.idCliente, data });
    } else {
      addCliente(data);
    }
    setIsFormVisible(false);
    setEditingCliente(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingCliente(null);
  };

  const handleAddNew = () => {
    setEditingCliente(null);
    setIsFormVisible(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        {!isFormVisible && (
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Añadir Nuevo Cliente
          </button>
        )}
      </div>

      {isFormVisible && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            {editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
          </h2>
          <ClienteForm
            onSubmit={handleFormSubmit}
            initialData={editingCliente || {}}
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

      <ClienteList
        clientes={filteredClientes}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ListaClientes;
