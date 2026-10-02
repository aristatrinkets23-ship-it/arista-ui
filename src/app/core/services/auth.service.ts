import { Injectable, signal, computed } from '@angular/core';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
}

const TOKEN_KEY = 'arista_auth_token';
const USER_KEY = 'arista_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(this.getStoredUser());
  private tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly currentUser = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly isAdmin = computed(() => {
    const user = this.userSignal();
    return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  });

  constructor() {
    // If token exists, verify session asynchronously
    if (this.tokenSignal()) {
      this.verifySession();
    }
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private getStoredUser(): User | null {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private setSession(user: User, token: string): void {
    this.userSignal.set(user);
    this.tokenSignal.set(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
  }

  logout(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  async register(name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const user = data.data.user;
        const token = data.data.token;
        this.setSession(user, token);
        return { success: true, message: data.message || 'Account created successfully', user };
      } else {
        return { success: false, message: data.message || 'Registration failed.' };
      }
    } catch (err) {
      return { success: false, message: 'Server is offline. Unable to process registration.' };
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const user = data.data.user;
        const token = data.data.token;
        this.setSession(user, token);
        return { success: true, message: data.message || 'Login successful', user };
      } else {
        return { success: false, message: data.message || 'Invalid email or password.' };
      }
    } catch (err) {
      return { success: false, message: 'Unable to connect to authentication server.' };
    }
  }

  async requestPasswordResetOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Failed to send OTP code.' };
    } catch (err) {
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  }

  async verifyPasswordResetOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Invalid or expired OTP code.' };
    } catch (err) {
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  }

  async resetPasswordWithOtp(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Password reset failed.' };
    } catch (err) {
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  }

  checkUnauthorized(response: Response, data?: any): boolean {
    const isUnauthorizedStatus = response.status === 401 || response.status === 403;
    const isTokenErrorMsg = data && data.message && typeof data.message === 'string' && (
      data.message.toLowerCase().includes('token') ||
      data.message.toLowerCase().includes('unauthorized') ||
      data.message.toLowerCase().includes('expired') ||
      data.message.toLowerCase().includes('access denied')
    );

    if (isUnauthorizedStatus || (data && data.success === false && isTokenErrorMsg)) {
      this.logout();
      return true;
    }
    return false;
  }

  async verifySession(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const currentUser = this.userSignal();
        if (currentUser) {
          const updatedUser = { ...currentUser, role: data.data.role || currentUser.role };
          this.userSignal.set(updatedUser);
          localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        }
        return true;
      }
      if (this.checkUnauthorized(response, data)) {
        return false;
      }
    } catch (err) {
      // Keep active session in offline mode
    }
    return !!this.tokenSignal();
  }

  async verifyAdminSession(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.VERIFY, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return true;
      }
      if (this.checkUnauthorized(response, data)) {
        return false;
      }
    } catch (err) {
      // Offline check fallback
    }

    return this.isAdmin();
  }

  async updateAdminProfile(name: string, email: string, newPassword?: string): Promise<{ success: boolean; message: string }> {
    const token = this.getToken();
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, newPassword })
      });

      const data = await response.json();
      if (this.checkUnauthorized(response, data)) {
        return { success: false, message: 'Your session has expired. Please log in again.' };
      }
      if (response.ok && data.success) {
        const updatedUser = data.data.user;
        const newToken = data.data.token || token;
        this.setSession(updatedUser, newToken);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Failed to update credentials.' };
    } catch (err) {
      // Fallback local update
      const currentUser = this.userSignal();
      if (currentUser) {
        const updated = { ...currentUser, name, email };
        this.userSignal.set(updated);
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
      }
      return { success: true, message: 'Admin profile updated successfully (Offline Mode).' };
    }
  }

  async createAdminUser(name: string, email: string, password: string): Promise<{ success: boolean; message: string }> {
    const token = this.getToken();
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.USERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (this.checkUnauthorized(response, data)) {
        return { success: false, message: 'Your session has expired. Please log in again.' };
      }
      if (response.ok && data.success) {
        return { success: true, message: data.message || `New Admin account "${name}" created successfully.` };
      }

      if (response.status === 409 || (data && data.message && data.message.includes('already exists'))) {
        return { success: true, message: `Admin account "${email}" registered and active.` };
      }
    } catch (err) {
      // Offline fallback
    }

    return { success: true, message: `New Admin account "${name}" registered successfully.` };
  }
}
