import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:5235/api/notifications';
  private unreadCount = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCount.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(userEmail: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userEmail}`);
  }

  getUnreadCount(userEmail: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count/${userEmail}`).pipe(
      tap(count => this.unreadCount.next(count))
    );
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-as-read/${id}`, {});
  }
}