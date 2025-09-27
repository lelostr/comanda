import { apiService, ApiResponse, ApiError } from "./apiService";
import { API_ENDPOINTS } from "../config/api";
import { Product, CreateProductRequest, UpdateProductRequest } from "../types/product";

class ProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST);

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw new Error("Erro ao carregar produtos");
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const endpoint = API_ENDPOINTS.PRODUCTS.SHOW.replace(":id", id);
      const response = await apiService.get<Product>(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw new Error("Erro ao carregar produto");
    }
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      const response = await apiService.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, productData);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Erro ao criar produto");
    } catch (error) {
      console.error("Erro ao criar produto:", error);

      if (error instanceof Error) {
        throw error;
      }

      const apiError = error as ApiError;
      throw new Error(apiError.message || "Erro ao criar produto");
    }
  }

  async updateProduct(id: string, productData: CreateProductRequest): Promise<Product> {
    try {
      const endpoint = API_ENDPOINTS.PRODUCTS.UPDATE.replace(":id", id);
      const response = await apiService.put<Product>(endpoint, productData);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error("Erro ao atualizar produto");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);

      if (error instanceof Error) {
        throw error;
      }

      const apiError = error as ApiError;
      throw new Error(apiError.message || "Erro ao atualizar produto");
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const endpoint = API_ENDPOINTS.PRODUCTS.DELETE.replace(":id", id);
      const response = await apiService.delete(endpoint);

      return response.success;
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw new Error("Erro ao deletar produto");
    }
  }
}

export const productService = new ProductService();
export default productService;
