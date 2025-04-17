import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';
@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.component.html',
  styleUrls: ['./application-page.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,UserSidebarComponent]
})
export class ApplicationPageComponent {
  applications: any[] = [];
  showModal = false;
  selectedApp: any = null;
  showPermissionsModal = false;
  modules: any[] = [];

  
  constructor(private http: HttpClient, private router: Router) {
    this.loadApplications();
  }

  loadApplications() {
    this.http.get('http://localhost:5235/api/applications')
      .subscribe({
        next: (data: any) => {
          this.applications = data;
        },
        error: (error) => {
          console.error('Error loading applications:', error);
        }
      });
  }
  openApplication(app: any) {
    this.selectedApp = app;
    this.showModal = false;
  
    this.http.get(`http://localhost:5235/api/modules/${app.id}`)
      .subscribe({
        next: (data: any) => {
          this.modules = data;
          this.showPermissionsModal = true;
        },
        error: (error) => {
          console.error('Error loading modules:', error);
        }
      });
  }
  closeModal() {
    this.showModal = false;
  }
  goNext() {
    console.log(`Selected module for ${this.selectedApp.name}`);
    this.showPermissionsModal = true;
    this.closeModal();
  }
  closePermissionsModal(event: MouseEvent) {
    event.stopPropagation();
    this.showPermissionsModal = false;
  }
  submitRequest() {
    const userEmail = localStorage.getItem('email');
    const userName = localStorage.getItem('name');
    const validateur1 = localStorage.getItem('validateur1');
  
    if (!userEmail || !userName || !this.selectedApp) {
      alert('Missing user or application information.');
      return;
    }
    console.log(validateur1);
    // Ensure validateur1 is present
    if (!validateur1) {
      alert('Validateur 1 is required for this request.');
      return;
    }
  
    const requestPayload = {
      userEmail,
      userName,
      applicationName: this.selectedApp.name,
      modulesJson: JSON.stringify(this.modules),
      validateur1,
      validateur2: localStorage.getItem('validateur2'),
      validateur3: localStorage.getItem('validateur3'),
      societe: localStorage.getItem('Societe'),
      fonction: localStorage.getItem('Fonction'),
      direction: localStorage.getItem('Direction'),
    };
  
    this.http.post('http://localhost:5235/api/user/request', requestPayload)
      .subscribe({
        next: () => {
          alert('Access request sent successfully!');
          this.showPermissionsModal = false;
        },
        error: (err) => {
          console.error('Error submitting request:', err);
          alert('Failed to send request.');
        }
      });
  }
  
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
}
