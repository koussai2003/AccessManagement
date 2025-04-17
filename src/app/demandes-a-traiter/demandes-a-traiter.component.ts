import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-demandes-a-traiter',
  standalone: true,
  imports: [CommonModule, FormsModule,UserSidebarComponent ],
  templateUrl: './demandes-a-traiter.component.html',
  styleUrls: ['./demandes-a-traiter.component.scss']
})
export class DemandesATraiterComponent implements OnInit {
  requests: any[] = [];
  selectedRequest: any = null;
  parsedModules: any[] = [];
  showModal = false;
  isSubmitting = false;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    const email = localStorage.getItem('email');
    if (email) {
      this.http.get<any[]>(`http://localhost:5235/api/user/request/pending-for-validateur/${email}`).subscribe({
        next: (data) => this.requests = data,
        error: (err) => console.error('Error loading requests:', err)
      });
    }
  }

  openRequest(req: any) {
    this.selectedRequest = req;
    this.parsedModules = JSON.parse(req.modulesJson || '[]');
    this.showModal = true;
  }

  validateRequest(id: number) {
    const email = localStorage.getItem('email');
    if (!email) return;
  
    this.isSubmitting = true;
  
    this.http.post(`http://localhost:5235/api/admin/requests/validate/${id}`, `"${email}"`, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: () => {
        alert("Request validated!");
        this.closeModal();
        this.ngOnInit(); // Refresh list
      },
      error: (err) => {
        console.error('Validation failed:', err);
        alert("Validation failed");
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
  

  closeModal() {
    this.showModal = false;
    this.selectedRequest = null;
  }
}
