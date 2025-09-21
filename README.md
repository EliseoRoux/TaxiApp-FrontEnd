# Panel de Administración - Central Taxis

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7.0.4-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-cyan)

Interfaz de usuario moderna y reactiva para interactuar con la API de Central Taxis. Permite a los administradores gestionar de forma intuitiva todas las operaciones de la central, desde conductores y clientes hasta reservas y servicios en tiempo real.

---

## ✨ Características Principales

* **Interfaz Moderna:** Construida con React y Vite para una experiencia de usuario rápida y fluida.
* **Gestión de Estado Asíncrona:** Uso de **TanStack Query (React Query)** para un manejo eficiente del estado del servidor, caching, y actualizaciones en tiempo real.
* **Tipado Estricto:** Desarrollada con **TypeScript** para un código más robusto, predecible y fácil de mantener.
* **Diseño Responsive:** Maquetación con **Tailwind CSS**, adaptándose a diferentes tamaños de pantalla.
* **Enrutamiento:** Navegación fluida entre las diferentes secciones de la aplicación con **React Router**.
* **Formularios Inteligentes:** Gestión de formularios avanzada y validaciones con **React Hook Form**.
* **Notificaciones:** Feedback al usuario mediante notificaciones (toasts) con **React Hot Toast**.
* **Comunicación Segura:** Interacción con la API a través de un cliente **Axios** configurado para enviar el token JWT en cada petición protegida.

## 🚀 Tecnologías Utilizadas

* **Librería Principal:** React
* **Build Tool:** Vite
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **Gestión de Estado del Servidor:** TanStack Query (React Query)
* **Routing:** React Router DOM
* **Peticiones HTTP:** Axios
* **Formularios:** React Hook Form
* **Notificaciones:** React Hot Toast
* **Despliegue:** Vercel

## ⚙️ Instalación y Puesta en Marcha

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/JFelixZuniga/Frontend-Projects](https://github.com/JFelixZuniga/Frontend-Projects)
    cd [nombre-de-la-carpeta-frontend]
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar las variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade la URL de tu API local.
    ```env
    VITE_API_URL=http://localhost:8080/api
    ```

4.  **Ejecutar la aplicación en modo desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## ✍️ Autor

* **Eliseo Roux**
* **LinkedIn:** www.linkedin.com/in/eliseo-roux-martínez-a29b89174
