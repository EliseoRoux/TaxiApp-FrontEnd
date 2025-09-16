import { useState } from "react";
import { useServicios } from "../hooks/useServicios";
import { ServicioList } from "../components/ServicioList";
import { ServicioForm } from "../components/ServicioForm";
import type { ServicioResponse, ServicioFormData } from "../types/servicio";

const ListaServicios = () => {
  const {
    servicios,
    conductores, // Ya no necesitamos 'clientes' aquí.
    isLoading,
    addServicio,
    editServicio,
    removeServicio,
  } = useServicios();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingServicio, setEditingServicio] =
    useState<ServicioResponse | null>(null);

  const handleEdit = (servicio: ServicioResponse) => {
    setEditingServicio(servicio);
    setIsFormVisible(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      removeServicio(id);
    }
  };

  // La lógica de submit ahora es muy sencilla.
  // Recibe los datos ya listos para la API desde el formulario.
  const handleFormSubmit = async (data: ServicioFormData) => {
    if (editingServicio) {
      editServicio({ id: editingServicio.idServicio, data });
    } else {
      addServicio(data);
    }
    setIsFormVisible(false);
    setEditingServicio(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingServicio(null);
  };

  const handleAddNew = () => {
    setEditingServicio(null);
    setIsFormVisible(true);
  };

  // Preparamos los datos para el formulario de edición.
  // Ahora pasamos el nombre y teléfono del cliente directamente.
  const initialDataForForm: Partial<ServicioFormData> = editingServicio
    ? {
        ...editingServicio,
        clienteNombre: editingServicio.cliente?.nombre || "",
        clienteTelefono: editingServicio.cliente?.telefono || "",
        idConductor: editingServicio.conductor?.idConductor || null,
      }
    : {};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Servicios</h1>

      {!isFormVisible && (
        <button
          onClick={handleAddNew}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Añadir Nuevo Servicio
        </button>
      )}

      {isFormVisible && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            {editingServicio ? "Editar Servicio" : "Nuevo Servicio"}
          </h2>
          <ServicioForm
            onSubmit={handleFormSubmit}
            initialData={initialDataForForm}
            onCancel={handleCancel}
            conductores={conductores}
          />
        </div>
      )}

      <ServicioList
        servicios={servicios}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ListaServicios;
