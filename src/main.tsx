import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Importar las herramientas de React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//  Crear el "cerebro" de React Query
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*  Envuelve la aplicación con el proveedor de React Query */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);