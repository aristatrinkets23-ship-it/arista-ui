import { ProductCardData } from './product-card-data.model';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product extends ProductCardData {
  description: string;
  materials: string[];
  careGuide: string;
  shippingInfo: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  metalType: string;
  gemstone?: string;
  specifications: ProductSpecification[];
}
