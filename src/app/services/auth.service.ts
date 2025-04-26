import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserData());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Public getter for current user value
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Login method with enhanced functionality
  login(role: string, token?: string, userData?: any): void {
    localStorage.setItem('role', role);
    if (token) {
      localStorage.setItem('token', token);
    }
    if (userData) {
      this.storeUserData(userData);
    }
    this.currentUserSubject.next(this.getUserData());
  }

  // Enhanced logout with navigation
  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('role');
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.isLoggedIn() && localStorage.getItem('role') === 'admin';
  }

  // Get JWT token if exists
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Store additional user data
  private storeUserData(userData: any): void {
    Object.keys(userData).forEach(key => {
      if (typeof userData[key] !== 'object' && userData[key] !== undefined) {
        localStorage.setItem(key, userData[key]);
      }
    });
  }

  // Get complete user data from localStorage
  private getUserData(): any {
    if (!this.isLoggedIn()) return null;

    return {
      role: localStorage.getItem('role'),
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      email: localStorage.getItem('email'),
      name: localStorage.getItem('name'),
      validateur1: localStorage.getItem('validateur1'),
      validateur2: localStorage.getItem('validateur2'),
      validateur3: localStorage.getItem('validateur3'),
      societe: localStorage.getItem('Societe'),
      fonction: localStorage.getItem('Fonction'),
      direction: localStorage.getItem('Direction')
    };
  }

  // Check if user needs to change password
  needsPasswordChange(): boolean {
    return localStorage.getItem('mustChangePassword') === 'true';
  }
}