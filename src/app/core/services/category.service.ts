import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export function getDefaultCategoryImage(nameOrSlug?: string): string {
  if (!nameOrSlug) return '/assets/images/placeholder-jewellery.svg';
  const s = nameOrSlug.toLowerCase();
  if (s.includes('ring')) return '/assets/images/occasion-daily-wear.webp';
  if (s.includes('necklace') || s.includes('pendant') || s.includes('choker')) return '/assets/images/occasion-wedding.webp';
  if (s.includes('earring') || s.includes('stud') || s.includes('hoop')) return '/assets/images/occasion-gifting.webp';
  if (s.includes('bracelet') || s.includes('bangle') || s.includes('cuff')) return '/assets/images/occasion-festive.webp';
  return '/assets/images/placeholder-jewellery.svg';
}

export function normalizeCategory(str?: string): string {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();
  private hasLoaded = false;

  getCategories(forceRefresh: boolean = false): Observable<Category[]> {
    if (this.hasLoaded && !forceRefresh && this.categoriesSubject.value.length > 0) {
      return this.categories$;
    }

    return this.refreshCategories();
  }

  refreshCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<any[]>>(API_ENDPOINTS.PRODUCTS.CATEGORIES).pipe(
      map(res => {
        if (!res || !res.success || !Array.isArray(res.data)) {
          return [];
        }
        return res.data.map(c => this.mapCategory(c));
      }),
      tap(categories => {
        this.hasLoaded = true;
        this.categoriesSubject.next(categories);
      }),
      catchError(err => {
        console.error('Error fetching categories from API:', err);
        return throwError(() => err);
      })
    );
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    const targetSlug = slug.toLowerCase().trim();
    if (this.hasLoaded && this.categoriesSubject.value.length > 0) {
      const found = this.categoriesSubject.value.find(c => c.slug.toLowerCase() === targetSlug);
      return of(found);
    }

    return this.getCategories().pipe(
      map(cats => cats.find(c => c.slug.toLowerCase() === targetSlug))
    );
  }

  private mapCategory(c: any): Category {
    let img = c.image ? String(c.image).trim() : '';
    if (img.includes('1611591475140') || img.includes('be38b794ff8d')) {
      img = '/assets/images/occasion-festive.webp';
    }
    const fallbackImg = getDefaultCategoryImage(c.slug || c.name);
    if (img && !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
      img = '/' + img;
    }

    return {
      id: c.id,
      name: c.name || '',
      slug: c.slug || '',
      description: c.description || '',
      image: img || fallbackImg,
      itemCount: Number(c.item_count !== undefined ? c.item_count : (c.itemCount || 0)),
      featured: Boolean(c.featured !== undefined ? c.featured : true),
      heroBanner: c.hero_banner || c.heroBanner || img || fallbackImg
    };
  }
}
