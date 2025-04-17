import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-validation-history',
  standalone: true,
  imports: [CommonModule, FormsModule, UserSidebarComponent],
  templateUrl: './validation-history.component.html',
  styleUrls: ['./validation-history.component.scss']
})
export class ValidationHistoryComponent implements OnInit {
  validations: any[] = [];
  parsedModules: any[] = [];
  showModal = false;
  selectedRequest: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const email = localStorage.getItem('email');
    if (email) {
      this.http.get<any[]>(`http://localhost:5235/api/user/request/validations-history/${email}`)
        .subscribe({
          next: (data) => this.validations = data,
          error: (err) => console.error('Failed to load validations:', err)
        });
    }
  }

  viewRequest(request: any) {
    this.selectedRequest = request;
    this.parsedModules = JSON.parse(request.modulesJson || '[]');
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedRequest = null;
  }
}
