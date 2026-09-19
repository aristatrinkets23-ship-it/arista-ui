export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  featured: boolean;
  heroBanner?: string;
}
