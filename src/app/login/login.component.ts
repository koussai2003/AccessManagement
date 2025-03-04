import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:5235/api/auth/login', this.credentials)
      .subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
          alert('Invalid email or password');
        }
      });
  }
}
