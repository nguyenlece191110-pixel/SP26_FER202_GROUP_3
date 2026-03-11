// API Configuration
export const API_BASE_URL = 'http://localhost:5001';

// API Endpoints
export const API_ENDPOINTS = {
    USERS: `${API_BASE_URL}/users`,
    PRODUCTS: `${API_BASE_URL}/products`,
    PRODUCT: (id) => `${API_BASE_URL}/products/${id}`
};

export default API_BASE_URL;
