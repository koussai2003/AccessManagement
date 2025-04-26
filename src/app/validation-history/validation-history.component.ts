import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';
import { NotificationBellComponent } from '../notification/notification.component';
@Component({
  selector: 'app-validation-history',
  standalone: true,
  imports: [CommonModule, FormsModule, UserSidebarComponent,NotificationBellComponent],
  templateUrl: './validation-history.component.html',
  styleUrls: ['./validation-history.component.scss']
})
export class ValidationHistoryComponent implements OnInit {
  validations: any[] = [];
  selectedRequest: any = null;
  parsedModules: any[] = [];
  showModal = false;
  moduleExpanded: boolean[] = [];
  selectedComment: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadValidationHistory();
  }

  loadValidationHistory() {
    const email = localStorage.getItem('email');
    if (email) {
      this.http.get<any[]>(`http://localhost:5235/api/user/request/validations-history/${email}`)
        .subscribe({
          next: (data) => this.validations = data,
          error: (err) => console.error('Failed to load validation history:', err)
        });
    }
  }

  getUserInitials(name: string): string {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  }

  viewRequest(request: any) {
    this.selectedRequest = request;
    this.selectedComment = request.validatorComment || '';
    try {
      this.parsedModules = JSON.parse(request.modulesJson || '[]');
      this.moduleExpanded = new Array(this.parsedModules.length).fill(true);
      this.showModal = true;
    } catch (e) {
      console.error('Error parsing modules:', e);
      this.parsedModules = [];
      this.moduleExpanded = [];
      this.showModal = true;
    }
  }

  toggleModule(index: number) {
    this.moduleExpanded[index] = !this.moduleExpanded[index];
  }

  closeModal() {
    this.showModal = false;
    this.selectedRequest = null;
    this.parsedModules = [];
  }
}