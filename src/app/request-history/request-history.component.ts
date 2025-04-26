import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationBellComponent } from '../notification/notification.component';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-request-history',
  standalone: true,
  imports: [CommonModule, FormsModule, UserSidebarComponent,NotificationBellComponent],
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.scss']
})
export class RequestHistoryComponent implements OnInit {
  requests: any[] = [];
  selectedRequest: any = null;
  parsedModules: any[] = [];
  showModal = false;
  isEditMode = false;
  moduleExpanded: boolean[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    const email = localStorage.getItem('email');
    if (email) {
      this.http.get<any[]>(`http://localhost:5235/api/user/request/history/${email}`)
        .subscribe({
          next: (data) => this.requests = data,
          error: (err) => console.error('Failed to load history:', err)
        });
    }
  }

  openRequest(req: any) {
    this.isEditMode = false;
    this.selectedRequest = req;
    this.parsedModules = JSON.parse(req.modulesJson || '[]');
    this.moduleExpanded = new Array(this.parsedModules.length).fill(true);
    this.showModal = true;
  }

  editRequest(req: any) {
    this.isEditMode = true;
    this.selectedRequest = req;
    this.parsedModules = JSON.parse(req.modulesJson || '[]');
    this.moduleExpanded = new Array(this.parsedModules.length).fill(true);
    this.showModal = true;
  }

  toggleModule(index: number) {
    this.moduleExpanded[index] = !this.moduleExpanded[index];
  }

  closeModal() {
    this.showModal = false;
    this.selectedRequest = null;
    this.parsedModules = [];
  }

  canEdit(req: any): boolean {
    return req.state === 'Not viewed' && !req.validatedBy1;
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    
    status = status.toLowerCase();
    if (status.includes('approved')) return 'approved';
    if (status.includes('rejected')) return 'rejected';
    if (status.includes('pending') || status.includes('not viewed')) return 'pending';
    if (status.includes('progress')) return 'in-progress';
    return '';
  }

  saveEditedRequest() {
    if (!this.selectedRequest) {
      console.error('No request selected');
      return;
    }

    const updatedRequest = {
      ...this.selectedRequest,
      modulesJson: JSON.stringify(this.parsedModules)
    };

    this.http.put(`http://localhost:5235/api/user/request/${this.selectedRequest.id}`, updatedRequest)
      .subscribe({
        next: () => {
          this.showModal = false;
          this.loadRequests();
          alert('Request updated successfully!');
        },
        error: (err) => {
          console.error('Failed to update request:', err);
          alert('Error updating request. Please try again.');
        }
      });
  }
}