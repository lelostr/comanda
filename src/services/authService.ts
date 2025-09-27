import { apiService, ApiResponse, ApiError } from "./apiService";
import { API_ENDPOINTS } from "../config/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
  expires_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);

      if (response.success && response.data) {
        // Salvar token no localStorage
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return response.data;
      }

      throw new Error("Resposta inválida da API");
    } catch (error) {
      console.error("Erro no login:", error);

      if (error instanceof Error) {
        throw error;
      }

      const apiError = error as ApiError;
      throw new Error(apiError.message || "Erro ao fazer login");
    }
  }

  async logout(): Promise<void> {
    try {
      // Tentar fazer logout na API (opcional)
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn("Erro ao fazer logout na API:", error);
    } finally {
      // Sempre limpar dados locais
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiService.get<User>(API_ENDPOINTS.AUTH.ME);

      if (response.success && response.data) {
        // Atualizar dados do usuário no localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar usuário atual:", error);
      return null;
    }
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem("auth_token");

    return !!token;
  }

  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Erro ao carregar usuário salvo:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
