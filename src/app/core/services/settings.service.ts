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
  invoicePrefix: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  gstNumber: '24AAACA1234A1Z5',
  gstPercentage: 3.0,
  deliveryCharge: 50.0,
  freeDeliveryThreshold: 600.0,
  companyName: 'Arista Trinkets Atelier',
  companyAddress: 'Atelier Suite 402, Heritage Diamond District, Surat, Gujarat 395003',
  companyPhone: '+91 98765 43210',
  companyEmail: 'concierge@aristatrinkets.com',
  invoicePrefix: 'INV-'
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<StoreSettings>(DEFAULT_SETTINGS);
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
            gstNumber: json.data.gstNumber || DEFAULT_SETTINGS.gstNumber,
            gstPercentage: Number(json.data.gstPercentage) || DEFAULT_SETTINGS.gstPercentage,
            deliveryCharge: Number(json.data.deliveryCharge) !== undefined && !isNaN(Number(json.data.deliveryCharge))
              ? Number(json.data.deliveryCharge)
              : DEFAULT_SETTINGS.deliveryCharge,
            freeDeliveryThreshold: Number(json.data.freeDeliveryThreshold) !== undefined && !isNaN(Number(json.data.freeDeliveryThreshold))
              ? Number(json.data.freeDeliveryThreshold)
              : DEFAULT_SETTINGS.freeDeliveryThreshold,
            companyName: json.data.companyName || DEFAULT_SETTINGS.companyName,
            companyAddress: json.data.companyAddress || DEFAULT_SETTINGS.companyAddress,
            companyPhone: json.data.companyPhone || DEFAULT_SETTINGS.companyPhone,
            companyEmail: json.data.companyEmail || DEFAULT_SETTINGS.companyEmail,
            invoicePrefix: json.data.invoicePrefix || DEFAULT_SETTINGS.invoicePrefix
          };
          this.settingsSubject.next(loaded);
          return loaded;
        }
      }
    } catch (err) {
      // Safe fallback to default settings if backend network glitch
    }
    return this.currentSettings;
  }

  public updateLocalSettings(settings: Partial<StoreSettings>): void {
    const updated = { ...this.currentSettings, ...settings };
    this.settingsSubject.next(updated);
  }
}
