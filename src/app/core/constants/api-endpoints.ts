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
  HOMEPAGE_CONFIG: `${BASE_URL}/homepage-config`,
  ENQUIRIES: `${BASE_URL}/enquiries`,
  CART: {
    GET: `${BASE_URL}/cart`,
    ADD: `${BASE_URL}/cart/items`,
    UPDATE: (productId: string | number) => `${BASE_URL}/cart/items/${productId}`,
    REMOVE: (productId: string | number) => `${BASE_URL}/cart/items/${productId}`,
    CLEAR: `${BASE_URL}/cart`,
    MERGE: `${BASE_URL}/cart/merge`
  },
  WISHLIST: {
    GET: `${BASE_URL}/wishlist`,
    TOGGLE: `${BASE_URL}/wishlist/toggle`,
    REMOVE: (idOrSlug: string | number) => `${BASE_URL}/wishlist/${idOrSlug}`,
    CLEAR: `${BASE_URL}/wishlist/clear`
  },
  ADMIN: {
    VERIFY: `${BASE_URL}/admin/verify`,
    DASHBOARD: `${BASE_URL}/admin/dashboard`,
    PROFILE: `${BASE_URL}/admin/profile`,
    USERS: `${BASE_URL}/admin/users`,
    USER_BY_ID: (id: string | number) => `${BASE_URL}/admin/users/${id}`,
    USER_PASSWORD: (id: string | number) => `${BASE_URL}/admin/users/${id}/password`,
    HOMEPAGE_CONFIG: `${BASE_URL}/admin/homepage-config`,
    PRODUCTS: `${BASE_URL}/admin/products`,
    PRODUCT_BY_ID: (id: string | number) => `${BASE_URL}/admin/products/${id}`,
    CATEGORIES: `${BASE_URL}/admin/categories`,
    CATEGORY_BY_ID: (id: string | number) => `${BASE_URL}/admin/categories/${id}`,
    ORDER_STATUS: (id: string | number) => `${BASE_URL}/admin/orders/${id}/status`
  }
};
