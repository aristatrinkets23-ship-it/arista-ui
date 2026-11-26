import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    ME: `${BASE_URL}/auth/me`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
    RESET_PASSWORD_OTP: `${BASE_URL}/auth/reset-password-otp`,
    UPDATE_PROFILE: `${BASE_URL}/auth/update-profile`,
    CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`
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
    MY_ORDERS: `${BASE_URL}/orders/my-orders`,
    TRACK: (trackingCode: string) => `${BASE_URL}/orders/track/${trackingCode}`,
    BY_NUMBER: (orderNumber: string) => `${BASE_URL}/orders/${orderNumber}`,
    CANCEL: (idOrNumber: string | number) => `${BASE_URL}/orders/${idOrNumber}/cancel`,
    INVOICE_PDF: (orderNumber: string) => `${BASE_URL}/orders/${orderNumber}/invoice-pdf`
  },
  SETTINGS: {
    GET: `${BASE_URL}/settings`
  },
  ADDRESSES: {
    LIST: `${BASE_URL}/addresses`,
    CREATE: `${BASE_URL}/addresses`,
    UPDATE: (id: number | string) => `${BASE_URL}/addresses/${id}`,
    DELETE: (id: number | string) => `${BASE_URL}/addresses/${id}`,
    SET_DEFAULT: (id: number | string) => `${BASE_URL}/addresses/${id}/default`
  },
  HOMEPAGE_CONFIG: `${BASE_URL}/homepage-config`,
  ENQUIRIES: `${BASE_URL}/enquiries`,
  NEWSLETTER: `${BASE_URL}/newsletter`,
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
    ORDER_STATUS: (id: string | number) => `${BASE_URL}/admin/orders/${id}/status`,
    ORDER_PAYMENT_STATUS: (id: string | number) => `${BASE_URL}/admin/orders/${id}/payment-status`,
    SETTINGS: `${BASE_URL}/admin/settings`,
    UPLOAD_IMAGE: `${BASE_URL}/admin/upload-image`,
    STORAGE_STATUS: `${BASE_URL}/admin/upload-status`
  }
};
