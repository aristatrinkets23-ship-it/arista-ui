import { ProductCardData } from './product-card-data.model';

export interface CartItem {
  product: ProductCardData;
  quantity: number;
  selectedMetal?: string;
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  estimatedShipping: number;
  estimatedTax: number;
  total: number;
  freeDeliveryThreshold?: number;
  deliveryCharge?: number;
  remainingForFreeDelivery?: number;
  isFreeDeliveryUnlocked?: boolean;
}
