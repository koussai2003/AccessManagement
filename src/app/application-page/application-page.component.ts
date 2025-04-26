import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';
import { NotificationBellComponent } from '../notification/notification.component';

@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.component.html',
  styleUrls: ['./application-page.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, UserSidebarComponent,NotificationBellComponent]
})
export class ApplicationPageComponent {
  applications: any[] = [];
  showPermissionsModal = false;
  selectedApp: any = null;
  modules: any[] = [];
  moduleExpanded: boolean[] = [];

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
    this.http.get(`http://localhost:5235/api/modules/${app.id}`)
      .subscribe({
        next: (data: any) => {
          this.modules = data;
          this.moduleExpanded = new Array(data.length).fill(true); // Expand all by default
          this.showPermissionsModal = true;
        },
        error: (error) => {
          console.error('Error loading modules:', error);
        }
      });
  }

  toggleModule(index: number) {
    this.moduleExpanded[index] = !this.moduleExpanded[index];
  }

  closePermissionsModal(event: MouseEvent) {
    event.stopPropagation();
    this.showPermissionsModal = false;
    this.modules = [];
  }

  submitRequest() {
    const userEmail = localStorage.getItem('email');
    const userName = localStorage.getItem('name');
    const validateur1 = localStorage.getItem('validateur1');

    if (!userEmail || !userName || !this.selectedApp) {
      alert('Missing user or application information.');
      return;
    }

    if (!validateur1) {
      alert('Primary validator is required for this request.');
      return;
    }
    console.log(
      validateur1,
      localStorage.getItem('validateur2'),
      localStorage.getItem('validateur3'),
      localStorage.getItem('Societe'),
      localStorage.getItem('Fonction'),
      localStorage.getItem('Direction'),)
    const requestPayload = {
      userEmail,
      userName,
      applicationName: this.selectedApp.name,
      modulesJson: JSON.stringify(this.modules),
      validateur1,
      validateur2: localStorage.getItem('validateur2') || null,
      validateur3: localStorage.getItem('validateur3') || null,
      societe: localStorage.getItem('Societe'),
      fonction: localStorage.getItem('Fonction'),
      direction: localStorage.getItem('Direction'),
      lockedByAdmin: null,
      validatorComment: null
    };

    this.http.post('http://localhost:5235/api/user/request', requestPayload)
      .subscribe({
        next: () => {
          alert('Access request submitted successfully!');
          this.showPermissionsModal = false;
        },
        error: (err) => {
          console.error('Error submitting request:', err);
          alert('Failed to submit request. Please try again.');
        }
      });
  }
}