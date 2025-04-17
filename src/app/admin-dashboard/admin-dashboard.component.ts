import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet] // ✅ RouterOutlet to load child components
})
export class AdminDashboardComponent {
  constructor(private router: Router) {}

  navigateTo(section: string) {
    this.router.navigate([`/admin-dashboard/${section}`]);
  }
  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
