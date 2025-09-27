import { apiService, ApiResponse, ApiError } from "./apiService";
import { API_ENDPOINTS } from "../config/api";
import { Tab, CreateTabRequest, AddProductRequest, RemoveProductRequest } from "../types/tab";

class TabService {
  async getTabs(): Promise<Tab[]> {
    try {
      const response = await apiService.get<Tab[]>(API_ENDPOINTS.TABS.LIST);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error("Erro ao buscar comandas:", error);
      throw new Error("Erro ao carregar comandas");
    }
  }

  async getTab(id: string): Promise<Tab | null> {
    try {
      const endpoint = API_ENDPOINTS.TABS.SHOW.replace(":id", id);
      const response = await apiService.get<Tab>(endpoint);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error("Erro ao buscar comanda:", error);
      throw new Error("Erro ao carregar comanda");
    }
  }

  async createTab(tabData: CreateTabRequest): Promise<Tab> {
    try {
      const response = await apiService.post<Tab>(API_ENDPOINTS.TABS.CREATE, tabData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error("Erro ao criar comanda");
    } catch (error) {
      console.error("Erro ao criar comanda:", error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Erro ao criar comanda");
    }
  }

  async updateTab(id: string, tabData: CreateTabRequest): Promise<Tab> {
    try {
      const endpoint = API_ENDPOINTS.TABS.UPDATE.replace(":id", id);
      const response = await apiService.put<Tab>(endpoint, tabData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error("Erro ao atualizar comanda");
    } catch (error) {
      console.error("Erro ao atualizar comanda:", error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Erro ao atualizar comanda");
    }
  }

  async deleteTab(id: string): Promise<boolean> {
    try {
      const endpoint = API_ENDPOINTS.TABS.DELETE.replace(":id", id);
      const response = await apiService.delete(endpoint);
      
      return response.success;
    } catch (error) {
      console.error("Erro ao deletar comanda:", error);
      throw new Error("Erro ao deletar comanda");
    }
  }

  async addProductToTab(tabId: string, productData: AddProductRequest): Promise<Tab> {
    try {
      const endpoint = API_ENDPOINTS.TABS.ADD_PRODUCT.replace(":id", tabId);
      const response = await apiService.post<Tab>(endpoint, productData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error("Erro ao adicionar produto à comanda");
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Erro ao adicionar produto");
    }
  }

  async removeProductFromTab(tabId: string, productData: RemoveProductRequest): Promise<Tab> {
    try {
      const endpoint = API_ENDPOINTS.TABS.REMOVE_PRODUCT.replace(":id", tabId);
      const response = await apiService.post<Tab>(endpoint, productData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error("Erro ao remover produto da comanda");
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Erro ao remover produto");
    }
  }

  async closeTab(tabId: string): Promise<Tab> {
    try {
      const endpoint = API_ENDPOINTS.TABS.CLOSE.replace(":id", tabId);
      const response = await apiService.post<Tab>(endpoint);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error("Erro ao encerrar comanda");
    } catch (error) {
      console.error("Erro ao encerrar comanda:", error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Erro ao encerrar comanda");
    }
  }
}

export const tabService = new TabService();
export default tabService;
