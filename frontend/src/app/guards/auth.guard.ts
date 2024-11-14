import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is logged in
  if (authService.isLoggedIn()) {
    return true; // Allow navigation
  } else {
    // Redirect to the login page if not logged in
    router.navigate(['/login']);
    return false; // Block navigation
  }
};
