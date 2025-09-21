import { API_BASE_URL } from "../../lib/apiClient";
import type { AuthResponse } from "./types";

const AUTH_API_URL = `${API_BASE_URL}/auth`;

export const loginUser = async (credentials: {username: string, password: string}): Promise<AuthResponse> => {
    const response = await fetch(`${AUTH_API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        throw new Error('Usuario o contraseña incorrectos');
    }
    return response.json();
};