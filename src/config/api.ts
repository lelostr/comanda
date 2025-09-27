// Configurações da API
export const API_CONFIG = {
  BASE_URL: "http://192.168.1.71:8000/api",
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
};

// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/me",
  },
  PRODUCTS: {
    LIST: "/products",
    CREATE: "/products",
    UPDATE: "/products/:id",
    DELETE: "/products/:id",
    SHOW: "/products/:id",
  },
};

export default API_CONFIG;
