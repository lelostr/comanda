export interface TabProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  quantity: number;
  subtotal: number;
}

export interface Tab {
  id: string;
  client_name: string;
  total_items: number;
  total_value: number;
  closed_at?: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
  products?: TabProduct[];
}

export interface CreateTabRequest {
  client_name: string;
}

export interface TabFormData {
  client_name: string;
}

export interface AddProductRequest {
  product_id: string;
  quantity: number;
}

export interface RemoveProductRequest {
  product_id: string;
}
