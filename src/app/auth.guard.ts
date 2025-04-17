import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = localStorage.getItem('role'); // ✅ Corrected key

    console.log('AuthGuard: User Role ->', userRole); // Debug log

    if (userRole === 'admin') {
      return true; // ✅ Allow access if user is an admin
    } else {
      console.warn('AuthGuard: Access Denied, Redirecting...');
      this.router.navigate(['/login']); // 🚫 Redirect if not an admin
      return false;
    }
  }
}
