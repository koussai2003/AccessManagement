import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-annex',
  templateUrl: './annex.component.html',
  styleUrls: ['./annex.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatProgressSpinnerModule]
})
export class AnnexComponent {
  newPassword = '';
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  getPasswordStrength(): number {
    if (!this.newPassword) return 0;
    
    let strength = 0;
    
    // Length check
    if (this.newPassword.length >= 8) strength++;
    if (this.newPassword.length >= 12) strength++;
    
    // Complexity checks
    if (/[A-Z]/.test(this.newPassword)) strength++;
    if (/\d/.test(this.newPassword)) strength++;
    if (/[^A-Za-z0-9]/.test(this.newPassword)) strength++;
    
    // Cap at 4 for the meter
    return Math.min(4, strength);
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch(strength) {
      case 0: return 'Very weak';
      case 1: return 'Weak';
      case 2: return 'Moderate';
      case 3: return 'Strong';
      case 4: return 'Very strong';
      default: return '';
    }
  }

  changePassword() {
    if (!this.newPassword) return;
    
    this.isLoading = true;
    const userId = localStorage.getItem('userId');

    this.http.post('http://localhost:5235/api/auth/change-password', { 
      userId, 
      newPassword: this.newPassword 
    }).subscribe({
      next: () => {
        alert('Password changed successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error changing password:', err);
        alert('Error changing password. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}