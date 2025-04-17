import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule,
           CommonModule,
           MatFormFieldModule, 
           MatInputModule, 
           MatCheckboxModule, 
           MatButtonModule,
           SpinnerComponent]
})
export class LoginComponent {
  isLoading: boolean = false;
  credentials = { email: '', password: '' };
  passwordFieldType = 'password';
  constructor(private http: HttpClient, private router: Router,private authService: AuthService ) {}
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login() {
    this.isLoading = true;
    this.http.post('http://localhost:5235/api/auth/login', this.credentials)
      .subscribe({
        next: (response: any) => {
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
          console.log(response);

          this.authService.login(response.role);
          setTimeout(() => {
          if (response.mustChangePassword) {
            this.router.navigate(['/annex']); // ✅ Redirect to annex if required
          } else if (response.role === 'admin') {
            this.router.navigate(['/admin-dashboard/users']); // ✅ Redirect admins
            
          } else {
            this.router.navigate(['/applications']); // Normal user redirection
            
          }
          this.isLoading = false;
        }, 100);
        },
        error: (error) => {
          console.error('Login failed', error);
          alert('Invalid email or password');
          this.isLoading = false;
        }
      });
  }
}
