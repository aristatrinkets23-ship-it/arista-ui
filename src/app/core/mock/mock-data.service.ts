import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductCardData } from '../models/product-card-data.model';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private categories: Category[] = [
    {
      id: 'cat-rings',
      name: 'Rings',
      slug: 'rings',
      description: 'Handcrafted solitaire, halo, and eternity rings set in 18K gold and sterling silver.',
      image: '/assets/images/placeholder-rings.svg',
      itemCount: 42,
      featured: true
    },
    {
      id: 'cat-necklaces',
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Elegant chokers, pendants, and layered chains designed to accentuate every neckline.',
      image: '/assets/images/placeholder-necklaces.svg',
      itemCount: 36,
      featured: true
    },
    {
      id: 'cat-earrings',
      name: 'Earrings',
      slug: 'earrings',
      description: 'Luminous freshwater pearl drop earrings, diamond studs, and handcrafted gold hoops.',
      image: '/assets/images/placeholder-earrings.svg',
      itemCount: 28,
      featured: true
    },
    {
      id: 'cat-bracelets',
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Timeless diamond cuff bracelets, delicate tennis chains, and signature bangles.',
      image: '/assets/images/placeholder-bracelets.svg',
      itemCount: 24,
      featured: true
    }
  ];

  private products: Product[] = [
    {
      id: 1,
      name: 'Eternal Solitaire Diamond Ring',
      slug: 'eternal-solitaire-diamond-ring',
      image: '/assets/images/placeholder-rings.svg',
      images: [
        '/assets/images/placeholder-rings.svg',
        '/assets/images/placeholder-jewellery.svg'
      ],
      price: 45000,
      compareAtPrice: 52000,
      badge: 'FEATURED',
      category: 'Rings',
      available: true,
      inStock: true,
      stockQuantity: 12,
      description: 'A brilliant 1.2-carat ethically sourced round solitaire diamond crowned upon an 18K warm gold band with delicate diamond micro-pave detailing.',
      materials: ['18K Warm Gold', 'Ethically Sourced Diamond'],
      careGuide: 'Clean gently with lukewarm soapy water and a soft microfiber cloth. Store separately in velvet pouch.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days. Includes official Arista Certificate of Authenticity.',
      metalType: '18K Warm Gold',
      gemstone: 'Diamond (1.2 ct)',
      specifications: [
        { label: 'Metal', value: '18K Warm Gold' },
        { label: 'Gemstone Weight', value: '1.20 Carat' },
        { label: 'Clarity', value: 'VVS1' },
        { label: 'Color Grade', value: 'F (Colorless)' },
        { label: 'Certification', value: 'Arista Fine Jewellery Hallmark' }
      ]
    },
    {
      id: 2,
      name: 'Royal Heritage Gold Choker',
      slug: 'royal-heritage-gold-choker',
      image: '/assets/images/placeholder-necklaces.svg',
      images: [
        '/assets/images/placeholder-necklaces.svg',
        '/assets/images/placeholder-jewellery.svg'
      ],
      price: 89000,
      compareAtPrice: 95000,
      badge: 'NEW',
      category: 'Necklaces',
      available: true,
      inStock: true,
      stockQuantity: 6,
      description: 'Inspired by classical royal heritage, this hand-engraved 18K solid gold choker features intricate filigree craftsmanship and subtle blush accents.',
      materials: ['18K Warm Gold', 'Filigree Wire Work'],
      careGuide: 'Avoid contact with perfumes, hairsprays, and harsh household chemicals.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
      metalType: '18K Solid Gold',
      specifications: [
        { label: 'Metal', value: '18K Yellow Gold' },
        { label: 'Length', value: '16 Inches (Adjustable)' },
        { label: 'Finish', value: 'Satin & Polished Gold' },
        { label: 'Weight', value: '28.5 Grams' }
      ]
    },
    {
      id: 3,
      name: 'Celestial Pearl Drop Earrings',
      slug: 'celestial-pearl-drop-earrings',
      image: '/assets/images/placeholder-earrings.svg',
      images: [
        '/assets/images/placeholder-earrings.svg',
        '/assets/images/placeholder-jewellery.svg'
      ],
      price: 24500,
      compareAtPrice: 28000,
      badge: 'SALE',
      category: 'Earrings',
      available: true,
      inStock: true,
      stockQuantity: 15,
      description: 'Luminous Grade-AAA Japanese Akoya freshwater pearls suspended beneath sparkling star-set brilliant diamond studs.',
      materials: ['Grade AAA Akoya Pearl', 'Sterling Silver', 'Brilliant Diamond'],
      careGuide: 'Pearls love natural oils. Put on after cosmetics application.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
      metalType: 'Sterling Silver with Gold Finish',
      gemstone: 'Freshwater Pearl & Diamond',
      specifications: [
        { label: 'Metal', value: 'Sterling Silver 925' },
        { label: 'Pearl Type', value: 'Natural Akoya Pearl 9mm' },
        { label: 'Diamond Weight', value: '0.15 Carat Total' },
        { label: 'Closure', value: 'Secure Push-Back Post' }
      ]
    },
    {
      id: 4,
      name: 'Classic Diamond Cuff Bracelet',
      slug: 'classic-diamond-cuff-bracelet',
      image: '/assets/images/placeholder-bracelets.svg',
      images: [
        '/assets/images/placeholder-bracelets.svg',
        '/assets/images/placeholder-jewellery.svg'
      ],
      price: 62000,
      compareAtPrice: 68000,
      badge: 'BESTSELLER',
      category: 'Bracelets',
      available: true,
      inStock: true,
      stockQuantity: 8,
      description: 'A sleek open-cuff bracelet featuring twin brilliant diamond solitaire terminals set in warm gold with high polish finish.',
      materials: ['18K Warm Gold', 'Brilliant Diamonds'],
      careGuide: 'Wipe down gently after wearing with included polishing cloth.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
      metalType: '18K Warm Gold',
      gemstone: 'Diamond (0.45 ct)',
      specifications: [
        { label: 'Metal', value: '18K Warm Gold' },
        { label: 'Diamond Weight', value: '0.45 Carat Total' },
        { label: 'Inner Circumference', value: '6.5 Inches' },
        { label: 'Style', value: 'Flex Open Cuff' }
      ]
    },
    {
      id: 5,
      name: 'Rose Gold Eternity Band',
      slug: 'rose-gold-eternity-band',
      image: '/assets/images/placeholder-rings.svg',
      images: [
        '/assets/images/placeholder-rings.svg',
        '/assets/images/placeholder-jewellery.svg'
      ],
      price: 38500,
      badge: 'NEW',
      category: 'Rings',
      available: true,
      inStock: true,
      stockQuantity: 10,
      description: 'A continuous band of hand-selected round brilliant diamonds claw-set in soft warm rose gold.',
      materials: ['18K Rose Gold', 'Conflict-Free Diamonds'],
      careGuide: 'Clean with warm soapy water.',
      shippingInfo: 'Complimentary insured express delivery.',
      metalType: '18K Rose Gold',
      gemstone: 'Diamond (0.75 ct)',
      specifications: [
        { label: 'Metal', value: '18K Rose Gold' },
        { label: 'Diamond Weight', value: '0.75 Carat Total' },
        { label: 'Width', value: '2.5 mm' }
      ]
    },
    {
      id: 6,
      name: 'Layered Gold Coin Pendant',
      slug: 'layered-gold-coin-pendant',
      image: '/assets/images/placeholder-necklaces.svg',
      images: [
        '/assets/images/placeholder-necklaces.svg',
        '/assets/images/placeholder-jewellery.svg'
      ],
      price: 31000,
      compareAtPrice: 35000,
      badge: 'SALE',
      category: 'Necklaces',
      available: true,
      inStock: true,
      stockQuantity: 14,
      description: 'A double-strand layered necklace holding a antique-inspired embossed gold medallion.',
      materials: ['14K Warm Gold Plated Sterling Silver'],
      careGuide: 'Keep dry and store in soft pouch.',
      shippingInfo: 'Complimentary insured express delivery.',
      metalType: '14K Gold Plated Silver',
      specifications: [
        { label: 'Metal', value: '14K Gold over 925 Silver' },
        { label: 'Chain Length', value: '18 + 20 Inches Layered' }
      ]
    }
  ];

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    const found = this.categories.find(c => c.slug.toLowerCase() === slug.toLowerCase());
    return of(found);
  }

  getFeaturedProducts(): Observable<ProductCardData[]> {
    return of(this.products.slice(0, 4));
  }

  getProducts(categorySlug?: string, sortBy?: string): Observable<ProductCardData[]> {
    let result = [...this.products];

    if (categorySlug && categorySlug !== 'all') {
      result = result.filter(p => p.category?.toLowerCase() === categorySlug.toLowerCase());
    }

    if (sortBy) {
      if (sortBy === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'newest') {
        result.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
      }
    }

    return of(result);
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    const lowerSlug = slug.toLowerCase();
    let found = this.products.find(p => p.slug.toLowerCase() === lowerSlug || p.id.toString() === slug);
    if (!found) {
      found = this.products.find(p => p.slug.includes(lowerSlug)) || this.products[0];
    }
    return of(found);
  }

  getRelatedProducts(currentSlug: string): Observable<ProductCardData[]> {
    const related = this.products.filter(p => p.slug !== currentSlug).slice(0, 4);
    return of(related);
  }

  addProduct(newProd: Partial<Product>): Product {
    const id = Date.now();
    const slug = (newProd.name || 'product-' + id).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const image = newProd.image || '/assets/images/placeholder-jewellery.svg';

    const fullProduct: Product = {
      id,
      name: newProd.name || 'New Jewellery Creation',
      slug,
      image,
      images: [image, '/assets/images/placeholder-jewellery.svg'],
      price: Number(newProd.price) || 0,
      compareAtPrice: newProd.compareAtPrice ? Number(newProd.compareAtPrice) : undefined,
      badge: (newProd.badge as any) || undefined,
      category: newProd.category || 'Rings',
      available: true,
      inStock: true,
      stockQuantity: newProd.stockQuantity || 10,
      description: newProd.description || 'Exquisite handcrafted fine jewellery piece by Arista Trinkets.',
      materials: ['18K Warm Gold', 'Fine Gemstones'],
      careGuide: 'Handle with care. Store in protective velvet box.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
      metalType: '18K Warm Gold',
      specifications: [
        { label: 'Category', value: newProd.category || 'Rings' },
        { label: 'Craftsmanship', value: 'Handcrafted Atelier Finish' }
      ]
    };

    this.products.unshift(fullProduct);
    return fullProduct;
  }

  updateProduct(id: number, updated: Partial<Product>): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      const existing = this.products[index];
      const name = updated.name || existing.name;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const image = updated.image || existing.image || '/assets/images/placeholder-jewellery.svg';

      this.products[index] = {
        ...existing,
        ...updated,
        name,
        slug,
        image,
        images: [image, '/assets/images/placeholder-jewellery.svg'],
        price: updated.price ? Number(updated.price) : existing.price,
        compareAtPrice: updated.compareAtPrice ? Number(updated.compareAtPrice) : existing.compareAtPrice,
        badge: (updated.badge as any) !== undefined ? (updated.badge as any) : existing.badge,
        category: updated.category || existing.category
      };
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
}
