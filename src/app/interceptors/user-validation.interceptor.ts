import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, Observable, of } from 'rxjs';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const userValidationInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const http = inject(HttpClient);
  const skipUrls = [
    '/api/auth/verify',        // To avoid infinite loop
    '/api/applications',       // Admin and users need this
    '/api/admin/users',        // Admin panel
    '/api/admin/add-user',
    '/api/admin/delete',
    '/api/admin/update-user',
    '/api/auth/change-password',
    '/api/admin/requests',     // Admin view
    '/api/modules', 
    '/api/auth/login',
    '/api/auth/register',
    'api/user/request',     
    '/api/applications'
  ];
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/verify')) {
    return next(req);
  }
  if (skipUrls.some(url => req.url.includes(url))) {
    return next(req); // Don’t run verification
  }
  const userId = localStorage.getItem('userId');
  if (userId) {
  return http.get(`http://localhost:5235/api/auth/verify/${userId}`).pipe(
    switchMap(() => next(req)),
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        localStorage.clear();
        router.navigate(['/login']);
        alert('Your account has been deleted. You were logged out.');
      }
      return throwError(() => err);
    })
  );
}
  return next(req);
};
