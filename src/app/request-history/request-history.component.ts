import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-request-history',
  standalone: true,
  imports: [CommonModule, FormsModule,UserSidebarComponent],
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.scss']
})
export class RequestHistoryComponent implements OnInit {
  requests: any[] = [];
  selectedRequest: any = null;
  parsedModules: any[] = [];
  showModal = false;
  isEditing = false;
  editableRequest: any = null;
  isEditMode = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const email = localStorage.getItem('email');
    if (email) {
      this.http.get<any[]>(`http://localhost:5235/api/user/request/history/${email}`).subscribe({
        next: (data) => this.requests = data,
        error: (err) => console.error('Failed to load history:', err)
      });
    }
  }
  loadRequests() {
    const email = localStorage.getItem('email');
    if (email) {
      this.http
        .get<any[]>(`http://localhost:5235/api/user/request/history/${email}`)
        .subscribe({
          next: (data) => (this.requests = data),
          error: (err) => console.error('Failed to load history:', err),
        });
    }
  }
  openRequest(req: any) {
    this.isEditMode = false;
    this.selectedRequest = req;
    this.parsedModules = JSON.parse(req.modulesJson || '[]');
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedRequest = null;
  }

  canEdit(req: any): boolean {
    return req.state === 'Not viewed' && !req.validatedBy1;
  }

  editRequest(req: any) {
    this.isEditMode = true;
    this.isEditing = true;
    this.selectedRequest = this.editableRequest;
    this.editableRequest = JSON.parse(JSON.stringify(req)); // deep copy to avoid live binding
    this.parsedModules = JSON.parse(req.modulesJson || '[]');
    this.showModal = true;
  }
  saveEditedRequest() {
    if (!this.editableRequest) {
      console.error('No editable request selected');
      return;
    }
  
    const updatedRequest = {
      ...this.editableRequest,
      modulesJson: JSON.stringify(this.parsedModules),
      applicationName: this.editableRequest.applicationName
      // Include other fields that might need updating
    };
  
    this.http.put(`http://localhost:5235/api/user/request/${this.editableRequest.id}`, updatedRequest)
      .subscribe({
        next: () => {
          this.showModal = false;
          this.isEditing = false;
          this.editableRequest = null;
          alert('Saved!');
          this.loadRequests(); // Refresh the list
        },
        error: (err) => {
          console.error('Failed to save changes:', err);
          alert('An error occurred while saving the request.');
        }
      });
  }
  
}
