import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';
import { NotificationBellComponent } from '../notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-demandes-a-traiter',
  standalone: true,
  imports: [CommonModule, FormsModule, UserSidebarComponent,NotificationBellComponent],
  templateUrl: './demandes-a-traiter.component.html',
  styleUrls: ['./demandes-a-traiter.component.scss']
})
export class DemandesATraiterComponent implements OnInit {
  requests: any[] = [];
  selectedRequest: any = null;
  parsedModules: any[] = [];
  showModal = false;
  isSubmitting = false;
  moduleExpanded: boolean[] = [];
  showRejectionComment = false;
  isRejecting = false;
  rejectionComment = '';
  showValidationComment = false;
  isValidating = false;
  validationComment = '';
  constructor(private http: HttpClient,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadPendingRequests();
  }

  loadPendingRequests() {
    const email = localStorage.getItem('email');
    if (email) {
      this.http.get<any[]>(`http://localhost:5235/api/user/request/pending-for-validateur/${email}`)
        .subscribe({
          next: (data) => this.requests = data,
          error: (err) => console.error('Error loading requests:', err)
        });
    }
  }

  getUserInitials(name: string): string {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  }

  openRequest(req: any) {
    this.selectedRequest = req;
    this.parsedModules = JSON.parse(req.modulesJson || '[]');
    this.moduleExpanded = new Array(this.parsedModules.length).fill(true);
    this.showModal = true;
  }

  toggleModule(index: number) {
    this.moduleExpanded[index] = !this.moduleExpanded[index];
  }
  validateRequest(id: number) {
    this.showValidationComment = true;
  }
  confirmValidation(id: number) {
    const email = localStorage.getItem('email');
    if (!email) return;
  
    this.isValidating = true;
    this.http.post(`http://localhost:5235/api/admin/requests/validate/${id}`, {
      validatorEmail: email,
      comment: this.validationComment,
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: () => {
        this.showModal = false;
        this.showValidationComment = false;
        this.validationComment = '';
        this.loadPendingRequests();
        this.snackBar.open('Request validated successfully', 'Close', {
          duration: 9000
        });
      },
      error: (err) => {
        console.error('Validation failed:', err);
        this.snackBar.open('Validation failed. Please try again.', 'Close', {
          duration: 9000
        });
      },
      complete: () => {
        this.isValidating = false;
      }
    });
  }
  rejectRequest(requestId: number) {
    this.showRejectionComment = true;
  }
  
  cancelRejection() {
    this.showRejectionComment = false;
    this.rejectionComment = '';
  }
  cancelValidation() {
    this.showValidationComment = false;
    this.validationComment = '';
  }
  confirmRejection(requestId: number) {
    const email = localStorage.getItem('email');
    if (!email) return;
  
    this.isRejecting = true;
  
    const rejectionData = {
      validatorEmail: email,
      comment: this.rejectionComment || null
    };
  
    this.http.post(`http://localhost:5235/api/admin/requests/validator-deny/${requestId}`, rejectionData)
      .subscribe({
        next: (response: any) => {
          this.showModal = false;
          this.showRejectionComment = false;
          this.rejectionComment = '';
          
          // Reload both pending requests and validation history
          this.loadPendingRequests();
          
          // If you're on the same page, you might want to show a success message
          this.snackBar.open('Request rejected successfully', 'Close', {
            duration: 9000
          });
        },
        error: (err) => {
          console.error('Rejection failed:', err);
          this.snackBar.open('Rejection failed. Please try again.', 'Close', {
            duration: 9000
          });
          this.isRejecting = false;
        }
      });
  }
  closeModal() {
    this.showModal = false;
    this.selectedRequest = null;
    this.parsedModules = [];
    this.showValidationComment = false;
    this.validationComment = '';
    this.showRejectionComment = false;
    this.rejectionComment = '';
  }
}