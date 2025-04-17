import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent {
  constructor(private router: Router) {}
  navigateTo(section: string) {
    this.router.navigate([`${section}`]);
  }
  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
