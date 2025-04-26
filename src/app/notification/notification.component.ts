import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule,MatIconModule,
    MatButtonModule,
    MatTooltipModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationBellComponent implements OnInit {
  showNotifications = false;
  notifications: any[] = [];
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user?.email) {
        this.loadNotifications(user.email);
        this.loadUnreadCount(user.email);
      }
    });
  }

  loadNotifications(email: string): void {
    this.notificationService.getNotifications(email).subscribe(
      notifications => this.notifications = notifications
    );
  }

  loadUnreadCount(email: string): void {
    this.notificationService.getUnreadCount(email).subscribe();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications && this.unreadCount > 0) {
      this.markAllAsRead();
    }
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe(() => {
      this.notifications = this.notifications.map(n => 
        n.id === id ? {...n, isRead: true} : n
      );
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    });
  }

  markAllAsRead(): void {
    const unreadIds = this.notifications
      .filter(n => !n.isRead)
      .map(n => n.id);
    
    unreadIds.forEach(id => this.markAsRead(id));
  }

  getNotificationIcon(type: string): string {
    switch(type) {
      case 'validation': return 'assignment';
      case 'status': return 'check_circle';
      case 'admin': return 'admin_panel_settings';
      default: return 'notifications';
    }
  }
}