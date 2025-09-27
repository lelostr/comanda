export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  price: number;
  description: string;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: string; // String para facilitar o input
  description: string;
}

export const PRODUCT_CATEGORIES = ["Bebidas", "Comidas", "Sobremesas", "Acompanhamentos", "Promoções", "Outros"] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
