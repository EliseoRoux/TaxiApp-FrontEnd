import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from './authAPI';
import type { User } from './types';

// Función para decodificar el nombre de usuario del token
const parseJwt = (token: string): { sub: string } => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return { sub: 'Usuario' };
  }
};


export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const username = parseJwt(token).sub;
            setUser({ username, id: 0 }); // El ID no es crucial aquí, lo importante es el nombre
        }
    }, []);

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            localStorage.setItem('authToken', data.token);
            setUser({ username: data.username, id: data.id });
        },
    });

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    return {
        user,
        login: loginMutation.mutate,
        isLoading: loginMutation.isPending,
        error: loginMutation.error as Error | null,
        logout,
    };
};