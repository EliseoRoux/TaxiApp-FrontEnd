import { useState } from "react";
import { useClientes } from "../hooks/useClientes";
import { ClienteForm } from "../components/ClienteForm";
import { ClienteList } from "../components/ClienteList";
import type { ClienteResponse, ClienteFormData } from "../types/cliente";

export const ListaClientes = () => {
  const { clientes, loading, addCliente, editCliente, removeCliente } = useClientes();
  const [editingCliente, setEditingCliente] = useState<ClienteResponse | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: ClienteFormData) => {
    try {
      if (editingCliente) {
        await editCliente(editingCliente.idCliente, data);
      } else {
        await addCliente(data);
      }
      setEditingCliente(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (cliente: ClienteResponse) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
      try {
        await removeCliente(id);
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se puede eliminar el cliente porque tiene servicios asociados");
      }
    }
  };

  const handleCancel = () => {
    setEditingCliente(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Nuevo Cliente
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <ClienteForm
            initialData={editingCliente || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      <ClienteList
        clientes={clientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};