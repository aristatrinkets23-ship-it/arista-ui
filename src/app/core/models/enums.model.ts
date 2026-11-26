/**
 * Arista Trinkets UI Enums (RULE-010: Use Enums and Constants Everywhere)
 */

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum PaymentMethod {
  RAZORPAY = 'RAZORPAY',
  UPI = 'UPI',
  CARD = 'CARD',
  NETBANKING = 'NETBANKING',
  COD = 'COD'
}
