export interface ProductCardData {
  id: number | string;
  name: string;
  slug: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  badge?: 'NEW' | 'SALE' | 'FEATURED' | 'BESTSELLER' | 'LOW STOCK';
  category?: string;
  available: boolean;
  ratingAverage?: number;
  reviewCount?: number;
}
