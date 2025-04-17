import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-requests.component.html',
  styleUrls: ['./view-requests.component.scss'],
})
export class ViewRequestsComponent implements OnInit {
  allRequests: any[] = [];
  requests: any[] = [];
  selectedRequest: any = null;
  parsedModules: any[] = [];
  showModal = false;
  adminComment = '';
  searchTerm: string = '';
  sortOrder: 'newest' | 'oldest' = 'newest';
  demIdMap: { [key: number]: number } = {};
  startDate: string = '';
  endDate: string = '';


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRequests();
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
  
  

  openRequest(request: any) {
    this.selectedRequest = request;
    this.parsedModules = JSON.parse(request.modulesJson || '[]');
    this.adminComment = '';
    this.showModal = true;

    if (request.state === 'Not viewed') {
      this.http.post(`http://localhost:5235/api/admin/requests/set-in-progress/${request.id}`, {})
        .subscribe({
          next: () => {
            request.state = 'In Progress';
            this.loadRequests();
          },
          error: (err) => console.error("Failed to set in progress:", err)
        });
    }
  }

  acceptRequest(id: number) {
    this.http.post(`http://localhost:5235/api/admin/requests/accept/${id}`, {}).subscribe(() => {
      this.closeModal();
      this.loadRequests();
    });
  }

  denyRequest(id: number) {
    this.http.post(`http://localhost:5235/api/admin/requests/deny/${id}`, this.adminComment, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(() => {
      this.closeModal();
      this.loadRequests();
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedRequest = null;
    this.adminComment = '';
  }
}