import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export interface NewsletterResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: {
    id?: number;
    email: string;
    alreadySubscribed?: boolean;
    reactivated?: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private http = inject(HttpClient);

  /**
   * Subscribe an email to The Arista Club newsletter
   * POST /api/v1/newsletter
   */
  subscribe(email: string): Observable<NewsletterResponse> {
    return this.http.post<NewsletterResponse>(API_ENDPOINTS.NEWSLETTER, { email });
  }
}
