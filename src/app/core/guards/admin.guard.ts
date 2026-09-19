import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user has admin role and valid token
  if (!authService.isAuthenticated() || !authService.isAdmin()) {
    router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url, reason: 'unauthorized' } });
    return false;
  }

  const isValidAdmin = await authService.verifyAdminSession();
  if (!isValidAdmin) {
    router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url, reason: 'session_expired' } });
    return false;
  }

  return true;
};
