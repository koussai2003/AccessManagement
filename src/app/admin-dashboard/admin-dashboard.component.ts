// admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet]
})
export class AdminDashboardComponent implements OnInit {
  userName: string = '';
  userInitials: string = '';
  userRole: string = '';
  userCount = 0;
  pendingRequests = 0;
  userDetails: any = {};

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const user = this.authService.currentUserValue;
    if (user) {
      this.userName = user.name || '';
      this.userRole = user.role || '';
      this.userDetails = {
        email: user.email,
        societe: user.societe,
        fonction: user.fonction,
        direction: user.direction
      };

      // Generate initials
      if (this.userName) {
        const names = this.userName.split(' ');
        this.userInitials = names.map(name => name[0]).join('').toUpperCase();
      }
    }
  }

  navigateTo(section: string) {
    this.router.navigate([`/admin-dashboard/${section}`]);
  }
  
  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  logout() {
    this.authService.logout();
  }
}