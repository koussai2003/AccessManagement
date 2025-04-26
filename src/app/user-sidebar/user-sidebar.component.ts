import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent implements OnInit {
  userName: string = '';
  userInitials: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const userData = this.authService.currentUserValue;
    if (userData) {
      this.userName = userData.name || '';
      
      // Generate initials from name
      if (this.userName) {
        const names = this.userName.split(' ');
        this.userInitials = names.map(name => name[0]).join('').toUpperCase();
      }
    }
  }

  navigateTo(section: string) {
    this.router.navigate([`${section}`]);
  }

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}