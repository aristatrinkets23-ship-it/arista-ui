import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactForm } from '../models/contact.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private http = inject(HttpClient);

  submitEnquiry(formData: ContactForm): Observable<any> {
    return this.http.post(API_ENDPOINTS.ENQUIRIES, formData);
  }
}
