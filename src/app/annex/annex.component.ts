import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-annex',
  templateUrl: './annex.component.html',
  styleUrls: ['./annex.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AnnexComponent {
  newPassword = '';

  constructor(private http: HttpClient, private router: Router) {}

  changePassword() {
    const userId = localStorage.getItem('userId'); // Get user ID

    this.http.post('http://localhost:5235/api/auth/change-password', { userId, newPassword: this.newPassword })
      .subscribe({
        next: () => {
          alert('Password changed successfully');
          this.router.navigate(['/dashboard']); // Redirect after success
        },
        error: () => {
          alert('Error changing password');
        }
      });
  }
}
