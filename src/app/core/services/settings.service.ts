import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export interface StoreSettings {
  gstNumber: string;
  gstPercentage: number;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyTiming: string;
  invoicePrefix: string;
}

const INITIAL_SETTINGS: StoreSettings = {
  gstNumber: '',
  gstPercentage: 0,
  deliveryCharge: 0,
  freeDeliveryThreshold: 0,
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companyTiming: '',
  invoicePrefix: 'INV-'
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<StoreSettings>(INITIAL_SETTINGS);
  public settings$: Observable<StoreSettings> = this.settingsSubject.asObservable();

  constructor() {
    this.fetchSettings();
  }

  public get currentSettings(): StoreSettings {
    return this.settingsSubject.value;
  }

  public async fetchSettings(): Promise<StoreSettings> {
    try {
      const res = await fetch(API_ENDPOINTS.SETTINGS.GET);
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.data) {
          const loaded: StoreSettings = {
            gstNumber: json.data.gstNumber ?? '',
            gstPercentage: Number(json.data.gstPercentage ?? 0),
            deliveryCharge: Number(json.data.deliveryCharge ?? 0),
            freeDeliveryThreshold: Number(json.data.freeDeliveryThreshold ?? 0),
            companyName: json.data.companyName ?? '',
            companyAddress: json.data.companyAddress ?? '',
            companyPhone: json.data.companyPhone ?? '',
            companyEmail: json.data.companyEmail ?? '',
            companyTiming: json.data.companyTiming ?? '',
            invoicePrefix: json.data.invoicePrefix ?? 'INV-'
          };
          this.settingsSubject.next(loaded);
          return loaded;
        }
      }
    } catch (err) {
      console.error('Failed to fetch live settings from backend:', err);
    }
    return this.currentSettings;
  }

  public updateLocalSettings(settings: Partial<StoreSettings>): void {
    const updated = { ...this.currentSettings, ...settings };
    this.settingsSubject.next(updated);
  }
}
