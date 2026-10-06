export interface ProductCardData {
  id: number | string;
  name: string;
  slug: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  badge?: 'NEW' | 'SALE' | 'FEATURED' | 'BESTSELLER' | 'LOW STOCK';
  category?: string;
  images?: string[];
  available: boolean;
  isActive?: boolean;
  inStock?: boolean;
  stockQuantity?: number;
  ratingAverage?: number;
  reviewCount?: number;
}
