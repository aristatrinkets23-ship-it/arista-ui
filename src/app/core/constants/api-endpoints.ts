import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    ME: `${BASE_URL}/auth/me`
  },
  PRODUCTS: {
    LIST: `${BASE_URL}/products`,
    BY_SLUG: (slug: string) => `${BASE_URL}/products/${slug}`,
    CATEGORIES: `${BASE_URL}/categories`
  },
  ORDERS: {
    CREATE: `${BASE_URL}/orders`,
    RAZORPAY_ORDER: `${BASE_URL}/orders/razorpay-order`,
    VERIFY_PAYMENT: `${BASE_URL}/orders/verify-payment`,
    BY_NUMBER: (orderNumber: string) => `${BASE_URL}/orders/${orderNumber}`
  },
  ADMIN: {
    VERIFY: `${BASE_URL}/admin/verify`,
    DASHBOARD: `${BASE_URL}/admin/dashboard`,
    PROFILE: `${BASE_URL}/admin/profile`,
    USERS: `${BASE_URL}/admin/users`,
    USER_BY_ID: (id: string | number) => `${BASE_URL}/admin/users/${id}`,
    USER_PASSWORD: (id: string | number) => `${BASE_URL}/admin/users/${id}/password`,
    PRODUCTS: `${BASE_URL}/admin/products`,
    PRODUCT_BY_ID: (id: string | number) => `${BASE_URL}/admin/products/${id}`,
    CATEGORIES: `${BASE_URL}/admin/categories`,
    CATEGORY_BY_ID: (id: string | number) => `${BASE_URL}/admin/categories/${id}`,
    ORDER_STATUS: (id: string | number) => `${BASE_URL}/admin/orders/${id}/status`
  }
};
