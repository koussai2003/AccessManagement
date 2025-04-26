import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faTasks, faSyncAlt, faInbox, faUser, 
  faCube, faCalendarAlt, faBuilding, faBriefcase,
  faSitemap, faFileAlt, faTimes, faCheckCircle,
  faTimesCircle, faPuzzlePiece, faCalendar, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-view-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './view-requests.component.html',
  styleUrls: ['./view-requests.component.scss']
})
export class ViewRequestsComponent implements OnInit {
  // Font Awesome Icons
  faTasks = faTasks;
  faSyncAlt = faSyncAlt;
  faInbox = faInbox;
  faUser = faUser;
  faCube = faCube;
  faCalendarAlt = faCalendarAlt;
  faBuilding = faBuilding;
  faBriefcase = faBriefcase;
  faSitemap = faSitemap;
  faFileAlt = faFileAlt;
  faTimes = faTimes;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faPuzzlePiece = faPuzzlePiece;
  faCalendar = faCalendar;
  faInfoCircle = faInfoCircle;

  allRequests: any[] = [];
  requests: any[] = [];
  selectedRequest: any = null;
  parsedModules: any[] = [];
  showModal = false;
  adminComment = '';
  searchTerm = '';
  sortOrder: 'newest' | 'oldest' = 'newest';
  startDate = '';
  endDate = '';
  currentAdminEmail = localStorage.getItem('email') || '';
  lockRefreshInterval!: Subscription;
  isRequestLocked = false;
  lockedBy = '';
  lockTime = '';
  showRejected = false;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRequests();
  }
  isRejectedOrFinished(state: string): boolean {
    return state === 'Finished' || 
           state === 'Rejected' || 
           state === 'Rejected by Validator 2' || 
           state === 'Rejected by Validator 3';
  }
  
  loadRequests() {
    this.http.get<any[]>('http://localhost:5235/api/admin/requests').subscribe({
      next: (data) => {
        this.allRequests = data;
        this.applyDateAndSortFilters();
      },
      error: (err) => console.error('Failed to load requests:', err),
    });
  }

  applyDateAndSortFilters() {
    const filtered = this.allRequests.filter((req) => {
      const reqDate = new Date(req.submittedAt);
      const isAfterStart = this.startDate ? reqDate >= new Date(this.startDate) : true;
      const isBeforeEnd = this.endDate ? reqDate <= new Date(this.endDate) : true;
      return isAfterStart && isBeforeEnd;
    });
  
    this.requests = filtered.sort((a, b) => {
      const dateA = new Date(a.submittedAt).getTime();
      const dateB = new Date(b.submittedAt).getTime();
      return this.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }
  toggleRejectedRequests() {
    this.showRejected = !this.showRejected;
    if (this.showRejected) {
      this.http.get<any[]>('http://localhost:5235/api/admin/requests/rejected').subscribe({
        next: (data) => {
          this.allRequests = data;
          this.applyDateAndSortFilters();
        },
        error: (err) => console.error('Failed to load rejected requests:', err),
      });
    } else {
      this.loadRequests();
    }
  }
  applyFilters() {
    const term = this.searchTerm.trim().toLowerCase();
  
    if (term.length > 0) {
      this.http.get<any[]>(`http://localhost:5235/api/admin/requests/search?query=${term}`).subscribe({
        next: (results) => {
          this.allRequests = results;
          this.applyDateAndSortFilters();
        },
        error: (err) => console.error('Search failed:', err)
      });
    } else {
      this.loadRequests();
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending admin':
        return 'status-pending';
      case 'finished':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'rejected by validator 2':
        return 'status-rejected';
      case 'rejected by validator 1':
        return 'status-rejected';
      case 'rejected by validator 3':
        return 'status-rejected';
      case 'in progress':
        return 'status-inprogress';
      default:
        return '';
    }
  }

  async openRequest(request: any) {
    try {
      this.selectedRequest = request;
      this.parsedModules = JSON.parse(request.modulesJson || '[]');
      this.adminComment = '';
      this.showModal = true;
  
      if (request.state === 'Not viewed') {
        this.http.post(`http://localhost:5235/api/admin/requests/set-in-progress/${request.id}`, {})
          .subscribe({
            next: () => {
              request.state = 'In Progress';
              this.selectedRequest.state = 'In Progress';
              this.loadRequests();
            },
            error: (err) => console.error("Failed to set in progress:", err)
          });
      }
    } catch (error: any) {
      console.error('Failed to open request:', error);
    }
  }
  setupLockRefresh(requestId: number) {
    // Clear any existing interval
    if (this.lockRefreshInterval) {
      this.lockRefreshInterval.unsubscribe();
    }
  
    // Refresh lock every 30 seconds
    this.lockRefreshInterval = interval(30000).subscribe(() => {
      this.http.post(
        `http://localhost:5235/api/admin/requests/lock/${requestId}`,
        `"${this.currentAdminEmail}"`, // Note the quotes to make it a valid JSON string
        {
          headers: { 'Content-Type': 'application/json' }
        }
      ).subscribe({
        next: () => console.log('Lock refreshed'),
        error: (err) => console.error('Failed to refresh lock:', err)
      });
    });
  }
  acceptRequest(id: number) {
    // First lock the request
    this.http.post(
      `http://localhost:5235/api/admin/requests/lock/${id}`,
      `"${this.currentAdminEmail}"`,
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: () => {
        // Then accept the request
        this.http.post(
          `http://localhost:5235/api/admin/requests/accept/${id}`,
          `"${this.currentAdminEmail}"`,
          { headers: { 'Content-Type': 'application/json' } }
        ).subscribe({
          next: () => {
            this.closeModal();
            this.loadRequests();
          },
          error: (err) => {
            console.error("Failed to accept request:", err);
            if (err.status === 400) {
              alert(err.error.message);
            }
          }
        });
      },
      error: (err) => {
        console.error("Failed to lock request:", err);
        if (err.status === 400) {
          alert(err.error.message);
        }
      }
    });
  }
  approveRequest(id: number) {
    this.http.post(
      `http://localhost:5235/api/admin/requests/approve/${id}`,
      `"${this.currentAdminEmail}"`,
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: () => {
        this.closeModal();
        this.loadRequests();
      },
      error: (err) => {
        console.error("Failed to approve request:", err);
        if (err.status === 400) {
          alert(err.error.message);
        }
      }
    });
  }
  unlockRequest(id: number) {
    this.http.post(
      `http://localhost:5235/api/admin/requests/unlock/${id}`,
      `"${this.currentAdminEmail}"`,
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: () => console.log('Request unlocked'),
      error: (err) => console.error('Failed to unlock request:', err)
    });
  }
  denyRequest(id: number) {
    const rejectionData = {
      adminEmail: this.currentAdminEmail,
      comment: this.adminComment
    };
  
    this.http.post(
      `http://localhost:5235/api/admin/requests/admin-deny/${id}`,
      JSON.stringify(rejectionData),
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: () => {
        this.closeModal();
        this.loadRequests();
      },
      error: (err) => {
        console.error("Failed to deny request:", err);
        if (err.status === 400) {
          alert(err.error.message);
        }
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedRequest = null;
    this.adminComment = '';
  }
  ngOnDestroy() {
    // Clean up the interval when component is destroyed
    if (this.lockRefreshInterval) {
      this.lockRefreshInterval.unsubscribe();
    }
  }
}