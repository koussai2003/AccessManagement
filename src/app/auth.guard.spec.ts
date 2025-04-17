import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // ✅ Add RouterTestingModule
      providers: [AuthGuard]
    });

    guard = TestBed.inject(AuthGuard); // ✅ Properly inject AuthGuard
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is admin', () => {
    localStorage.setItem('userRole', 'admin'); // ✅ Simulate admin login
    expect(guard.canActivate()).toBeTrue(); // ✅ Should allow access
  });

  it('should deny access and redirect if user is not admin', () => {
    localStorage.setItem('userRole', 'user'); // ✅ Simulate non-admin user
    spyOn(router, 'navigate'); // ✅ Mock redirection
    expect(guard.canActivate()).toBeFalse(); // ❌ Should deny access
    expect(router.navigate).toHaveBeenCalledWith(['/login']); // ✅ Should redirect
  });

  afterEach(() => {
    localStorage.removeItem('userRole'); // ✅ Cleanup
  });
});
