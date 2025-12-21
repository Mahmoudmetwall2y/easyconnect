import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      return true;
    }

    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: '/booking' }
    });
    return false;
  }
}
