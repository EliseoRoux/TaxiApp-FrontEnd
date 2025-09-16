
import { useState } from "react";
import { ClienteList } from "../components/ClienteList";
import { ClienteForm } from "../components/ClienteForm";
import { useClientes } from "../hooks/useClientes";
import type { ClienteResponse, ClienteFormData } from "../types/cliente";

const ListaClientes = () => {
  const { 
    clientes, 
    isLoading, 
    addCliente, 
    editCliente, 
    removeCliente 
  } = useClientes();

  // Estados para controlar la UI
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCliente, setEditingCliente] = useState<ClienteResponse | null>(null);

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
      // Si estamos editando, llamamos a la mutación de editar
      editCliente({ id: editingCliente.idCliente, data });
    } else {
      // Si no, llamamos a la mutación de crear
      addCliente(data);
    }
    // Cerramos el formulario después de enviar
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
      <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>

      {!isFormVisible && (
        <button
          onClick={handleAddNew}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Añadir Nuevo Cliente
        </button>
      )}

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
      
      <ClienteList
        clientes={clientes}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ListaClientes;