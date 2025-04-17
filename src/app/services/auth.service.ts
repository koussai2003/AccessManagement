import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(role: string) {
    localStorage.setItem('role', role); // ✅ Ensure consistency
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('role'); // ✅ Check correct key
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin'; // ✅ Ensure correct key
  }

  logout() {
    localStorage.removeItem('role'); // ✅ Ensure correct key
    localStorage.removeItem('token'); // ✅ Remove token as well
    localStorage.clear();
  }
}
