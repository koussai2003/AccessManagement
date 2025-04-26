import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faEnvelope, faLock, faEye, faEyeSlash, 
  faExclamationCircle 
} from '@fortawesome/free-solid-svg-icons';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    SpinnerComponent
  ]
})
export class LoginComponent {
  // Font Awesome Icons
  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faExclamationCircle = faExclamationCircle;

  credentials = { email: '', password: '' };
  passwordFieldType = 'password';
  rememberMe = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.post('http://localhost:5235/api/auth/login', this.credentials)
      .subscribe({
        next: (response: any) => {
          // Store all user data in localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('role', response.role);
          localStorage.setItem('email', response.email);
          localStorage.setItem('name', response.name);
          localStorage.setItem('validateur1', response.validateur1);
          localStorage.setItem('validateur2', response.validateur2 || '');
          localStorage.setItem('validateur3', response.validateur3 || '');
          localStorage.setItem('Societe', response.Societe);
          localStorage.setItem('Fonction', response.Fonction);
          localStorage.setItem('Direction', response.Direction);
          this.authService.login(response.role);
          
          if (response.mustChangePassword) {
            this.router.navigate(['/annex']);
          } else if (response.role === 'admin') {
            this.router.navigate(['/admin-dashboard/users']);
          } else {
            this.router.navigate(['/applications']);
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = error.error?.message || 'Invalid email or password';
          this.isLoading = false;
        }
      });
  }
}