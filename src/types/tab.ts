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

export interface TabPayment {
  id: string;
  payer_name?: string;
  payment_value: number;
  payment_method: string;
  created_at: string;
}

export interface Tab {
  id: string;
  client_name: string;
  total_items: number;
  total_value: number;
  closed_at?: string;
  is_closed: boolean;
  total_paid: number;
  remaining_amount: number;
  is_fully_paid: boolean;
  is_overpaid: boolean;
  created_at: string;
  updated_at: string;
  products?: TabProduct[];
  payments?: TabPayment[];
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

export interface AddPaymentRequest {
  payer_name?: string;
  payment_value: number;
  payment_method: string;
}

export interface PaymentFormData {
  payer_name: string;
  payment_value: string;
  payment_method: string;
}

export const PAYMENT_METHODS = ["Dinheiro", "Cartão de Débito", "Cartão de Crédito", "PIX", "Transferência", "Outros"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
